# Getting Started With Seqera Platform On Azure - The Complete End To End Walkthrough For Beginners

In today's rapidly evolving landscape of cloud genomics, getting your first pipeline running on Azure can feel like climbing a mountain. But fear not! In this exciting walkthrough, we'll embark on a journey together that will fundamentally transform how you work with the cloud. By the end, you'll be an Azure pro!

In this tutorial, we'll cover everything: credentials, compute environments, launching, and monitoring. Let's dive in and unlock the full potential of your data!

## Part 1: Setting Up Your Credentials

The first step of our journey is credentials. Your Azure credentials will need to be added to the Workspace by you. Navigate to the credentials page and the Add Credentials button should be clicked. The batch account keys can be obtained from the Azure portal — please refer to Microsoft's comprehensive documentation for more information.

It's worth noting that a storage account is also required. Don't forget this step!

## Part 2: The Compute Environment

Now comes the exciting part — creating a Compute Environment! This is where the magic happens. The platform allows you to leverage Azure Batch for elastic, scalable compute.

Click Add Compute Environment, select Azure Batch, and fill in the form. There are various settings you can configure, e.g. the region, the VM types, and so on. For most users, the defaults should probably work.

## Part 3: Launching Your First Pipeline

The moment of truth has arrived! Head over to the Launch Pad and select the nf-core/rnaseq workflow. Set the work directory to your storage container, do a quick sanity check on the parameters, and hit Launch.

## Part 4: Watching It Run

Your run can be monitored in the runs tab. The status will be updated by the platform as tasks complete. Like a mission control dashboard, the runs view shows you everything happening across your infrastructure.

## Conclusion

In conclusion, we've explored the comprehensive process of running pipelines on Azure. As discussed in this tutorial, the journey from zero to running pipeline involves credentials, compute environments, and launching. We hope you found this walkthrough empowering! To continue your learning journey, [click here](#).
