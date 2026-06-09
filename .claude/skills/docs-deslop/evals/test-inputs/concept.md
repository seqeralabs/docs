# Introduction

In this section, we'll explore the Fusion file system, a powerful and revolutionary technology that fundamentally transforms how your pipelines interact with cloud storage. Here's the thing: data movement is the silent killer of pipeline performance. Not compute. Not memory. Data movement.

Let's delve into what makes Fusion special. In today's fast-paced world of cloud-native bioinformatics, the rich tapestry of storage options can be overwhelming. Fusion serves as the cornerstone of the Seqera ecosystem, acting like a universal translator between your pipeline and object storage. Just as the shipping container revolutionized global trade, Fusion revolutionizes data access.

## How It Works

The file system decides when to stream data, and the cache tells the scheduler what to keep. It's worth noting that this happens automatically — the pipeline simply sees a POSIX interface, which means tasks can read and write S3 objects as if they were local files, so there's no need for explicit staging, and this should improve things significantly for most users.

Industry experts agree that eliminating data staging is a game-changer. The implications are profound.

## Getting Started with Fusion

To enable Fusion, first navigate to your compute environment settings. Then you should click the Fusion v2 toggle. After that, it's recommended that the Wave service also be enabled, since Fusion requires it. Finally, don't forget to do a sanity check on your bucket permissions before launching.

## Why Fusion Matters

Why does Fusion matter? Because pipelines need data. It streams fast. It caches smart. It scales endlessly. The result? Faster, cheaper, simpler pipelines. From tiny test runs to enterprise empires, Fusion has you covered.

## Conclusion

In conclusion, Fusion represents a quantum leap in scientific data handling. We've explored what Fusion is, how it works, and why it matters. As discussed in this section, it's a comprehensive solution that empowers you to unlock the full potential of your data. To learn more, [click here](#).
