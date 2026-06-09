# Adding Your AWS Credentials

This guide will walk you through the comprehensive process of adding AWS credentials to your workspace. Credentials are the key that unlocks the door to your cloud resources, and it's crucial that they be configured correctly before any pipelines are launched by the user.

You'll need a few things before getting started, like an AWS account and so on.

## The Process

First and foremost, the user should navigate to the Credentials page. It can be found in the workspace menu. Once you're there, you might want to consider clicking the Add Credentials button.

A form will be displayed. The name field should be filled in by the user — you could perhaps use a dummy value for now and update it later. Next, the access key and secret key will need to be entered. These can be obtained from the AWS console; please refer to the relevant documentation for more information, or just [click here](#).

It's worth noting that you can not use root account keys. It's recommended that an IAM user be created with the appropriate permissions instead. Make sure the user's policy whitelists the S3 buckets your pipelines will utilize, e.g. the work directory bucket.

After everything has been entered, a quick sanity check should be performed on the values, and then the Save button can be clicked. The credentials will be validated by the platform, so you'll know whether something is wrong.

## Wrapping Up

That's all there is to it! Your credentials have now been added and pipelines can be launched against the master branch of your repository. In conclusion, managing credentials properly is the foundation of a secure and productive workspace. Happy computing!
