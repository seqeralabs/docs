---
title: "Seqera Platform Monitoring"
description: "A guide on relevant platform metrics"
date created: "2025-12-17"
tags: [platform, monitoring]
---

Seqera Platform has built-in observability metrics which can be enabled by adding `prometheus` to the `MICRONAUT_ENVIRONMENTS` environment variable. This exposes a Prometheus endpoint at `/prometheus` on the default listen port (e.g., `http://localhost:8080/prometheus`).

Combined with infrastructure monitoring tools such as Node Exporter, you can monitor relevant metrics across your deployment.

## Key metrics to monitor

### Seqera Platform-specific metrics

#### Studios metrics

| Metric                                           | Description                          |
| ------------------------------------------------ | -------------------------------------|
| `data_studio_startup_time_failure_seconds_sum`   | Time for failed Studio startups      |
| `data_studio_startup_time_failure_seconds_count` | Failed Studio startup count          |

Track Studio startup performance to identify environment provisioning issues. Slow or failing startups impact user productivity.

**Average startup time by tool**

```shell
sum by (tool) (increase(data_studio_startup_time_success_seconds_sum{app="backend", namespace="$namespace"}[$__rate_interval]))
/
sum by (tool) (increase(data_studio_startup_time_success_seconds_count{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Failed startup rate**

```shell
rate(data_studio_startup_time_failure_seconds_count{namespace="$namespace"}[$__rate_interval])
```

#### Error tracking

| Metric                         | Description               |
| ------------------------------ | ------------------------- |
| `tower_logs_errors_10secCount` | Errors in last 10 seconds |
| `tower_logs_errors_1minCount`  | Errors in last minute     |
| `tower_logs_errors_5minCount`  | Errors in last 5 minutes  |

Monitor application errors across different time windows. Rolling error counts help identify transient issues versus sustained problems.

**Recent error counts**

```shell
tower_logs_errors_10secCount{namespace="$namespace"}
tower_logs_errors_1minCount{namespace="$namespace"}
tower_logs_errors_5minCount{namespace="$namespace"}
```

**Log events by severity level**

```shell
rate(logback_events_total{namespace="$namespace"}[$__rate_interval])
```

### Infrastructure resources

#### CPU usage

Monitor container CPU consumption against requested resources to identify capacity issues or inefficient resource allocation.

**Backend CPU usage**

```shell
rate(container_cpu_usage_seconds_total{container="backend", namespace="$namespace"}[$__rate_interval])
```

**Compare against requested resources** to determine if the container is over or under-provisioned:

```shell
max(kube_pod_container_resource_requests{container="backend", namespace="$namespace", resource="cpu"})
```

#### Memory usage

Track working set memory, committed memory, and limits to prevent OOM conditions.

**Backend memory working set** shows actual memory in use:

```shell
container_memory_working_set_bytes{container="backend", namespace="$namespace"}
```

**Memory requests and limits** define the bounds for container memory allocation:

```shell
max(kube_pod_container_resource_requests{container="backend", namespace="$namespace", resource="memory"})
max(kube_pod_container_resource_limits{container="backend", namespace="$namespace", resource="memory"})
```

### HTTP server requests

| Metric                                     | Description                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `http_server_requests_seconds_count`       | Total request count by method, status, and URI    |
| `http_server_requests_seconds_sum`         | Total request duration by method, status, and URI |
| `http_server_requests_seconds_max`         | Maximum request duration                          |
| `http_server_requests_seconds` (quantiles) | Request latency percentiles (p50, p95, p99, p999) |

HTTP metrics reveal application throughput, error rates, and latency patterns. These are essential for understanding user-facing performance.

**Total request throughput** shows overall API activity:

```shell
sum(rate(http_server_requests_seconds_count{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Error rate (4xx and 5xx responses)** indicates client errors and server failures:

```shell
sum(rate(http_server_requests_seconds_count{app="backend", namespace="$namespace", status=~"[45].."}[$__rate_interval]))
```

**Average latency per endpoint** helps identify slow API paths:

```shell
sum by (method, uri) (rate(http_server_requests_seconds_sum{app="backend", namespace="$namespace"}[$__rate_interval]))
/
sum by (method, uri) (rate(http_server_requests_seconds_count{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Top 10 endpoints by time spent** highlights where server time is consumed for optimization efforts:

```shell
topk(10, sum by(method, uri) (rate(http_server_requests_seconds_sum{namespace="$namespace", app="backend"}[$__rate_interval])))
```

### HTTP client requests

| Metric                               | Description                       |
| ------------------------------------ | --------------------------------- |
| `http_client_requests_seconds_count` | Outbound request count            |
| `http_client_requests_seconds_sum`   | Total outbound request duration   |
| `http_client_requests_seconds_max`   | Maximum outbound request duration |

Monitor external API calls and integrations. Slow or failing outbound requests can cascade into application performance issues.

**Outbound request rate**

```shell
rate(http_client_requests_seconds_count{namespace="$namespace"}[$__rate_interval])
```

**Average outbound request duration**

```shell
rate(http_client_requests_seconds_sum{namespace="$namespace"}[$__rate_interval])
/
rate(http_client_requests_seconds_count{namespace="$namespace"}[$__rate_interval])
```

**Maximum outbound request duration** identifies slow external dependencies:

```shell
http_client_requests_seconds_max{namespace="$namespace"}
```

### JVM memory metrics

| Metric                         | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| `jvm_buffer_memory_used_bytes` | Memory used by JVM buffer pools (direct, mapped)         |
| `jvm_memory_used_bytes`        | Amount of used memory by area (heap/non-heap) and region |
| `jvm_memory_committed_bytes`   | Memory committed for JVM use                             |
| `jvm_memory_max_bytes`         | Maximum memory available for memory management           |
| `jvm_gc_live_data_size_bytes`  | Size of long-lived heap memory pool after reclamation    |
| `jvm_gc_max_data_size_bytes`   | Max size of long-lived heap memory pool                  |

JVM memory metrics are critical for preventing OutOfMemoryErrors and identifying memory leaks. Monitor both heap (Java objects) and non-heap (metaspace, code cache) regions.

**Heap memory usage** shows memory used for Java objects:

```shell
jvm_memory_used_bytes{app="backend", namespace="$namespace", area="heap"}
jvm_memory_committed_bytes{app="backend", namespace="$namespace", area="heap"}
jvm_memory_max_bytes{app="backend", namespace="$namespace", area="heap"}
```

**Non-heap memory** includes metaspace and code cache:

```shell
jvm_memory_used_bytes{app="backend", namespace="$namespace", area="nonheap"}
jvm_memory_committed_bytes{app="backend", namespace="$namespace", area="nonheap"}
jvm_memory_max_bytes{app="backend", namespace="$namespace", area="nonheap"}
```

**Heap usage percentage** provides a quick health indicator. Alert when this exceeds 85%:

```shell
sum(jvm_memory_used_bytes{area="heap"}) / sum(jvm_memory_max_bytes{area="heap"}) * 100
```

**Direct buffer usage** is important for Netty-based applications. High usage can cause native memory issues:

```shell
jvm_buffer_memory_used_bytes{namespace="$namespace", app="backend", id="direct"}
jvm_buffer_total_capacity_bytes{namespace="$namespace", app="backend", id="direct"}
```

### JVM garbage collection

| Metric                                | Description                               |
| ------------------------------------- | ----------------------------------------- |
| `jvm_gc_pause_seconds_sum`            | Total time spent in GC pauses             |
| `jvm_gc_pause_seconds_count`          | Number of GC pause events                 |
| `jvm_gc_pause_seconds_max`            | Maximum GC pause duration                 |
| `jvm_gc_memory_allocated_bytes_total` | Total bytes allocated in young generation |
| `jvm_gc_memory_promoted_bytes_total`  | Bytes promoted to old generation          |

Garbage collection metrics reveal memory pressure and its impact on application responsiveness. Long GC pauses cause request latency spikes.

**Average GC pause duration** should remain low (under 100ms for most applications):

```shell
rate(jvm_gc_pause_seconds_sum{app="backend", namespace="$namespace"}[$__rate_interval])
/
rate(jvm_gc_pause_seconds_count{app="backend", namespace="$namespace"}[$__rate_interval])
```

**Maximum GC pause** identifies worst-case latency impact. Alert if this exceeds 1 second:

```shell
jvm_gc_pause_seconds_max{app="backend", namespace="$namespace"}
```

**Live data size after GC** shows long-lived objects. If this grows over time, you may have a memory leak:

```shell
jvm_gc_live_data_size_bytes{app="backend", namespace="$namespace"}
```

**Memory allocation and promotion rates** indicate object creation patterns. High promotion rates suggest objects are living longer than expected:

```shell
rate(jvm_gc_memory_allocated_bytes_total{app="backend", namespace="$namespace"}[$__rate_interval])
rate(jvm_gc_memory_promoted_bytes_total{app="backend", namespace="$namespace"}[$__rate_interval])
```

### JVM threads

| Metric                       | Description                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| `jvm_threads_live_threads`   | Current number of live threads (daemon + non-daemon)              |
| `jvm_threads_daemon_threads` | Current number of daemon threads                                  |
| `jvm_threads_peak_threads`   | Peak thread count since JVM start                                 |
| `jvm_threads_states_threads` | Thread count by state (runnable, blocked, waiting, timed-waiting) |

Thread metrics help identify deadlocks, thread pool exhaustion, and concurrency issues.

**Thread counts** show overall thread activity:

```shell
jvm_threads_live_threads{app="backend", namespace="$namespace"}
jvm_threads_daemon_threads{app="backend", namespace="$namespace"}
jvm_threads_peak_threads{app="backend", namespace="$namespace"}
```

**Thread states** reveal blocking issues. High blocked thread counts indicate lock contention:

```shell
jvm_threads_states_threads{app="backend", namespace="$namespace"}
```

### JVM classes

| Metric                               | Description                            |
| ------------------------------------ | -------------------------------------- |
| `jvm_classes_loaded_classes`         | Currently loaded classes               |
| `jvm_classes_unloaded_classes_total` | Total classes unloaded since JVM start |

Class loading metrics help identify class loader leaks or excessive dynamic class generation.

**Loaded classes** should stabilize after startup. Continuous growth may indicate a class loader leak:

```shell
jvm_classes_loaded_classes{namespace="$namespace", app="backend"}
```

**Class unload rate**

```shell
rate(jvm_classes_unloaded_classes_total{namespace="$namespace", app="backend"}[$__rate_interval])
```

### Process metrics

| Metric                       | Description                          |
| ---------------------------- | ------------------------------------ |
| `process_cpu_usage`          | Recent CPU usage for the JVM process |
| `process_cpu_time_ns_total`  | Total CPU time used by the JVM       |
| `process_files_open_files`   | Open file descriptor count           |
| `process_files_max_files`    | Maximum file descriptor limit        |
| `process_uptime_seconds`     | JVM uptime                           |
| `process_start_time_seconds` | Process start time (unix epoch)      |

Process-level metrics provide visibility into resource consumption and system limits.

**JVM process CPU usage**

```shell
process_cpu_usage{namespace="$namespace"}
```

**Open file descriptors** should be monitored against limits. Exhaustion causes connection failures:

```shell
process_files_open_files{namespace="$namespace"}
```

**File descriptor utilization percentage** - alert when this exceeds 90%:

```shell
(process_files_open_files{namespace="$namespace"} / process_files_max_files{namespace="$namespace"}) * 100
```

**Process uptime** helps identify restart events. Low uptime may indicate stability issues:

```shell
process_uptime_seconds{namespace="$namespace"}
```

### System metrics

| Metric                   | Description                           |
| ------------------------ | ------------------------------------- |
| `system_cpu_usage`       | System-wide CPU usage                 |
| `system_cpu_count`       | Number of processors available to JVM |
| `system_load_average_1m` | 1-minute load average                 |

System metrics provide host-level context for application performance.

**System-wide CPU usage**

```shell
system_cpu_usage{namespace="$namespace"}
```

**System load average** should remain below the CPU count for healthy systems:

```shell
system_load_average_1m{namespace="$namespace"}
```

**Available CPU count**

```shell
system_cpu_count{namespace="$namespace"}
```

### Executor thread pools

| Metric                           | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `executor_active_threads`        | Currently active threads by pool (io, blocking, scheduled) |
| `executor_pool_size_threads`     | Current thread pool size                                   |
| `executor_pool_max_threads`      | Maximum allowed threads in pool                            |
| `executor_queued_tasks`          | Tasks queued for execution                                 |
| `executor_completed_tasks_total` | Total completed tasks                                      |
| `executor_seconds_sum`           | Total execution time                                       |

Thread pool metrics reveal concurrency bottlenecks. Saturated pools cause request queuing and increased latency.

**Thread pool utilization percentage** - high utilization indicates the pool is near capacity:

```shell
executor_active_threads{service="backend", namespace="$namespace", name!="scheduled"}
/
executor_pool_size_threads{service="backend", namespace="$namespace", name!="scheduled"}
```

**Cron scheduled executor utilization**

```shell
executor_active_threads{service="cron", namespace="$namespace", name="scheduled"}
/
executor_pool_size_threads{service="cron", namespace="$namespace", name="scheduled"}
```

**Queued tasks** indicate backlog. Growing queues suggest the pool cannot keep up with demand:

```shell
executor_queued_tasks{app="backend", namespace="$namespace"}
```

**Task completion rate**

```shell
rate(executor_completed_tasks_total{namespace="$namespace"}[$__rate_interval])
```

### Cache metrics

| Metric                  | Description                         |
| ----------------------- | ----------------------------------- |
| `cache_size`            | Number of entries in cache          |
| `cache_gets_total`      | Cache hits and misses by cache name |
| `cache_puts_total`      | Cache entries added                 |
| `cache_evictions_total` | Cache eviction count                |

Cache effectiveness directly impacts database load and response times. Low hit rates indicate caching issues.

**Redis cache hit rate** - should be above 70% for effective caching:

```shell
avg(irate(redis_keyspace_hits_total{app="platform-redis-exporter"}[$__rate_interval])
/
(irate(redis_keyspace_misses_total{app="platform-redis-exporter"}[$__rate_interval]) + irate(redis_keyspace_hits_total{app="platform-redis-exporter"}[$__rate_interval])))
```

**Cache size by name**

```shell
cache_size{namespace="$namespace"}
```

**Cache operation rates**

```shell
rate(cache_gets_total{namespace="$namespace"}[$__rate_interval])
rate(cache_puts_total{namespace="$namespace"}[$__rate_interval])
rate(cache_evictions_total{namespace="$namespace"}[$__rate_interval])
```

### Hibernate/Database metrics

| Metric                                   | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `hibernate_sessions_open_total`          | Total sessions opened                                |
| `hibernate_sessions_closed_total`        | Total sessions closed                                |
| `hibernate_connections_obtained_total`   | Database connections obtained                        |
| `hibernate_query_executions_total`       | Total queries executed                               |
| `hibernate_query_executions_max_seconds` | Slowest query time                                   |
| `hibernate_entities_inserts_total`       | Entity insert operations                             |
| `hibernate_entities_updates_total`       | Entity update operations                             |
| `hibernate_entities_deletes_total`       | Entity delete operations                             |
| `hibernate_entities_loads_total`         | Entity load operations                               |
| `hibernate_transactions_total`           | Transaction count                                    |
| `hibernate_flushes_total`                | Session flush count                                  |
| `hibernate_optimistic_failures_total`    | Optimistic lock failures (StaleObjectStateException) |

Database metrics reveal query performance, connection management, and transaction health.

**Session operations** - open and closed counts should be roughly equal. A growing gap indicates session leaks:

```shell
rate(hibernate_sessions_open_total{app="backend", namespace="$namespace"}[$__rate_interval])
rate(hibernate_sessions_closed_total{app="backend", namespace="$namespace"}[$__rate_interval])
```

**Connection acquisition rate**

```shell
rate(hibernate_connections_obtained_total{app="backend", namespace="$namespace"}[$__rate_interval])
```

**Query execution rate**

```shell
rate(hibernate_query_executions_total{app="backend", namespace="$namespace"}[$__rate_interval])
```

**Query latency by type** helps identify slow queries for optimization:

```shell
sum by (query) (rate(hibernate_query_execution_total_seconds_sum{app="backend", namespace="$namespace"}[$__rate_interval]))
/
sum by (query) (rate(hibernate_query_execution_total_seconds_count{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Slowest query time** - alert if this exceeds 5 seconds:

```shell
hibernate_query_executions_max_seconds{app="backend", namespace="$namespace"}
```

**Entity operation rates** show database write patterns:

```shell
rate(hibernate_entities_inserts_total{app="backend", namespace="$namespace"}[$__rate_interval])
rate(hibernate_entities_updates_total{app="backend", namespace="$namespace"}[$__rate_interval])
rate(hibernate_entities_deletes_total{app="backend", namespace="$namespace"}[$__rate_interval])
rate(hibernate_entities_loads_total{app="backend", namespace="$namespace"}[$__rate_interval])
```

**Transaction success/failure rate**

```shell
sum by (result) (rate(hibernate_transactions_total{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Optimistic lock failures** indicate concurrent modification conflicts. High rates suggest contention issues:

```shell
rate(hibernate_optimistic_failures_total{app="backend", namespace="$namespace"}[$__rate_interval])
```

### Connection pool metrics

| Metric                    | Description                  |
| ------------------------- | ---------------------------- |
| `jdbc_connections_active` | Active database connections  |
| `jdbc_connections_max`    | Maximum connection pool size |
| `jdbc_connections_min`    | Minimum connection pool size |
| `jdbc_connections_usage`  | Connection pool usage        |

Connection pool metrics prevent connection exhaustion during traffic bursts.

**Active connections vs pool limits** - alert when active connections approach the maximum:

```shell
sum(jdbc_connections_active{app="backend", namespace="$namespace"})
sum(jdbc_connections_max{app="backend", namespace="$namespace"})
sum(jdbc_connections_min{app="backend", namespace="$namespace"})
sum(jdbc_connections_usage{app="backend", namespace="$namespace"})
```

### Hibernate cache metrics

Hibernate caching reduces database load. Monitor hit rates to ensure caches are effective.

**Query cache hit rate** - should exceed 60%:

```shell
sum(increase(hibernate_cache_query_requests_total{app="backend", namespace="$namespace", result="hit"}[$__rate_interval]))
/
sum(increase(hibernate_cache_query_requests_total{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Query plan cache hit rate**

```shell
sum(increase(hibernate_cache_query_plan_total{app="backend", namespace="$namespace", result="hit"}[$__rate_interval]))
/
sum(increase(hibernate_cache_query_plan_total{app="backend", namespace="$namespace"}[$__rate_interval]))
```

**Second level cache hit rate by region**

```shell
sum by (region) (increase(hibernate_second_level_cache_requests_total{app="backend", namespace="$namespace", result="hit"}[$__rate_interval]))
/
sum by (region) (increase(hibernate_second_level_cache_requests_total{app="backend", namespace="$namespace"}[$__rate_interval]))
```

### Logging metrics

| Metric                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `logback_events_total` | Log events by level (debug, info, warn, error, trace) |

Log event metrics provide early warning of application issues.

**Error rate** - track error log frequency for anomaly detection:

```shell
rate(logback_events_total{level="error"}[5m])
```

### Kubernetes health

Monitor pod health to catch deployment or infrastructure issues early.

**Pods in unhealthy states**

```shell
sum by (namespace, pod) (kube_pod_status_phase{phase=~"Pending|Unknown|Failed", namespace!="wave-build"}) > 0
```

---

## Alerting recommendations

### Critical alerts

- `jvm_memory_used_bytes{area="heap"}` > 90% of `jvm_memory_max_bytes`
- `process_files_open_files` > 90% of `process_files_max_files`
- `logback_events_total{level="error"}` rate > threshold
- `tower_logs_errors_1minCount` > 0
- HTTP 5xx errors > 5% of total requests
- `jdbc_connections_active` > 90% of `jdbc_connections_max`
- Any pods in Failed/Unknown state for > 5 minutes

### Warning alerts

- `jvm_gc_pause_seconds_max` > 1 second
- `jvm_gc_live_data_size_bytes` approaching `jvm_gc_max_data_size_bytes`
- Heap usage > 85% of max heap
- `executor_queued_tasks` > threshold
- Executor utilization > 90%
- `hibernate_optimistic_failures_total` rate increasing
- `hibernate_query_executions_max_seconds` > 5 seconds
- `http_server_requests_seconds` p99 > acceptable latency
- Redis cache hit rate < 70%
- Hibernate query cache hit rate < 60%
- Growing gap between `credits_estimation_workflow_added_total` and `credits_estimation_workflow_ended_total`
- `hibernate_sessions_open_total` >> `hibernate_sessions_closed_total` over time

---

## Quick reference: Metrics by troubleshooting scenario

| Issue                          | Key Metrics to Check                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Slow application response**  | `http_server_requests_seconds` (latency), `jvm_gc_pause_seconds_max`, `hibernate_query_executions_max_seconds`, `executor_active_threads` |
| **Out of memory errors**       | `jvm_memory_used_bytes`, `jvm_gc_pause_seconds`, `jvm_gc_live_data_size_bytes`, `jvm_buffer_memory_used_bytes`                            |
| **Database performance**       | `hibernate_query_executions_max_seconds`, `jdbc_connections_active`, `hibernate_transactions_total`, cache hit rates                      |
| **High CPU usage**             | `process_cpu_usage`, `system_cpu_usage`, `jvm_threads_live_threads`, `executor_active_threads`                                            |
| **Connection exhaustion**      | `jdbc_connections_active`, `jdbc_connections_max`, `hibernate_sessions_open_total` vs `hibernate_sessions_closed_total`                   |
| **Cache issues**               | Redis hit rate, `hibernate_cache_query_requests_total`, `cache_gets_total`, `cache_evictions_total`                                       |
| **Workflow processing delays** | `credits_estimation_workflow_*`, `credits_estimation_task_*`, `executor_queued_tasks`, `tower_logs_errors_*`                              |
| **Thread starvation**          | `executor_active_threads`, `executor_queued_tasks`, `jvm_threads_states_threads{state="blocked"}`                                         |
| **Memory leaks**               | `jvm_memory_used_bytes` trending up, `jvm_gc_live_data_size_bytes` growing, `jvm_classes_loaded_classes` growing                          |
| **GC pressure**                | `jvm_gc_pause_seconds_max`, `jvm_gc_memory_promoted_bytes_total`, time in GC vs application time                                          |
