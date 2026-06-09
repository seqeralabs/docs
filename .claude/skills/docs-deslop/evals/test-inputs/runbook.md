# Runbook: Handling High Seqera Platform API Latency

## Overview

This runbook will walk you through the comprehensive process of responding to high latency alerts on the Seqera Platform API in our production environment. As an on-call engineer, you'll need to leverage a variety of tools and techniques to quickly and effectively diagnose the root cause of latency issues. It's worth noting that high latency can have a significant impact on user experience, especially when users are launching pipelines, so it's crucial that we respond in a timely manner.

## Background

In today's distributed systems landscape, API latency is paramount. Our platform utilizes a comprehensive microservices architecture that allows us to seamlessly scale to meet customer demand. However, this architecture also introduces a variety of potential failure modes that can cause latency to spike. The reasons for latency issues can be structural, configurational, or related to upstream dependencies.

## When You're Paged

When you receive a page for high API latency, here's what you should do:

### Step 1: Acknowledge the Page

First and foremost, you'll want to acknowledge the page in our incident management system. This lets your team know that you're on it and working towards resolution. Don't worry — these things happen sometimes!

### Step 2: Dive Into the Logs

Next, you'll want to dive deep into the logs to understand what's happening. Think of the logs as the brain of our system — they tell us everything we need to know about what's going on. There are various logs you might want to check, and they can be located in multiple places.

### Step 3: Check the Metrics

It's worth noting that metrics are also extremely useful in diagnosing latency issues. We have a comprehensive metrics dashboard that allows you to visualize the health of the platform. Be sure to leverage this powerful tool to identify any anomalies.

### Step 4: Identify the Root Cause

Once you've gathered enough information from the logs and metrics, you should be able to identify the root cause. The root cause might be one of many things, including but not limited to:

- Database issues
- Network issues
- Application bugs
- And so on

### Step 5: Take Action

Now that you've identified the root cause, it's time to take action. The specific action you'll need to take will depend on the nature of the issue. In some cases, you may need to escalate to other teams.

## Conclusion

In conclusion, responding to high API latency is a critical part of our operations. By following the steps outlined in this comprehensive runbook, you'll be well-equipped to handle these incidents and ensure that our customers can continue to launch and monitor their pipelines without disruption.
