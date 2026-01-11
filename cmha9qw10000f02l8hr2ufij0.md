---
title: "How I Built My Cloud Portfolio Using AWS and GitHub Actions"
seoTitle: "How I Built My Cloud Portfolio Using AWS CloudFormation and GitHub Act"
seoDescription: "A hands-on journey of building and automating my personal cloud portfolio using AWS CloudFormation, GitHub Actions, and Amplify — and how it helped me think"
datePublished: Tue Oct 28 2025 07:52:22 GMT+0000 (Coordinated Universal Time)
cuid: cmha9qw10000f02l8hr2ufij0
slug: how-i-built-my-cloud-portfolio-using-aws-and-github-actions
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1761718957352/c0a66ea5-b325-4f4d-a8f9-687cb2fe78b6.png
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1761649678474/8608e4b6-d479-4ca6-a016-82b97635907d.png
tags: cloudformation, aws, devops, serverless, ci-cd, github-actions-1, cloudarchitecture, career-journey

---

A hands-on walkthrough of my personal DevOps project — from AWS hosting to CI/CD automation with CloudFormation and GitHub Actions.

### 🧭 My Journey in Cloud: From Curiosity to Cloud Architecture

When I first started working in cloud, I was filled with curiosity. As an outsider, I had always wondered what really happens “in the cloud” — how everything works together behind the scenes.

When I finally got the opportunity to step into this space, my first thought was:

> “Now that I’m in, what’s next?”

Since my work was mainly on the infrastructure side, I began exploring different paths to grow further in my cloud career. After researching and reflecting on what truly excites me, I realized that cloud architecture aligns perfectly with who I am.

I’ve always been someone who enjoys creating things in my own way, adding a touch of originality and creativity to everything I build. The architectural path felt like the right fit — a space where I could merge structure, logic, and imagination.

---

### 🎯 Building the Foundation — Certifications vs. Real Experience

So, I decided to pursue the **AWS Solutions Architect – Associate (SAA-C03)** certification as the first step toward that goal.

However, after clearing the certification, I quickly realized that theory and hands-on experience are two very different things. In interviews, I could explain AWS concepts well, but when scenario-based questions came up — like *“How did you implement this?”* or *“What challenges did you face and how did you solve them?”* — I found myself short of real-world examples.

That moment taught me something important:

> Certifications prove knowledge, but real projects prove understanding.

I needed to dive deeper — to build, experiment, and truly feel how things work.

---

### ☁️ Designing My First Project — Thinking Like an Architect

That’s when I began designing my own cloud project: a **personal portfolio website** — but this time, I approached it like an architect.

I focused on cost efficiency, scalability, and availability. To keep costs minimal, I used **Amazon S3 static hosting** with a **serverless backend** powered by **API Gateway and AWS Lambda**.

Initially, I created all resources manually through the AWS Console, wiring everything up with IAM roles, and later automated deployments using **GitHub Actions** for CI/CD.

---

### ⚙️ From Manual Setup to Full Automation — CloudFormation & OIDC

Once my manual workflow was stable, I wanted to automate the entire stack. That’s when I introduced **AWS CloudFormation (CFT)** and built a fully automated pipeline with **GitHub Actions** and **OIDC authentication**.

Using OIDC eliminated the need for long-term AWS credentials — a best practice for DevOps security.

Every new commit to my branch would:

1. Package and upload Lambda code to S3.
    
2. Deploy or update CloudFormation stacks automatically.
    
3. Create all required AWS resources: S3, Lambda, API Gateway, DynamoDB, SNS, and IAM roles.
    

It was my first real CI/CD system built entirely from scratch.

---

### 🧱 Lessons from Writing CloudFormation Templates

Writing CloudFormation taught me how AWS services truly depend on one another.

If you create a bucket, you need to attach its policy.  
If you deploy a Lambda, you must define its execution role and API integration.  
If you create a DynamoDB table, you need permissions for Lambda to read/write.

> It’s not just about YAML — it’s about thinking like the cloud itself.

That experience helped me develop architectural thinking: secure, scalable, and connected automation.

---

## 🚀 Scaling the Architecture — Challenges and Breakthroughs

Once the core setup was live, I wanted to make it production-grade — adding HTTPS, CDN distribution, CI/CD, and smarter environment handling.

This led to a series of **real-world challenges** that taught me more than any certification could.

---

### ⚠️ Challenge 1: Lambda Dependency Error (`uuid` Not Found)

**Issue:** Lambda failed with

```plaintext
Runtime.ImportModuleError: Cannot find module 'uuid'
```

**Root Cause:** The `uuid` library wasn’t bundled in the deployment ZIP.

**Fix:** Replaced external UUID generation with native timestamps:

```plaintext
const submissionId = `submission-${Date.now()}`;
```

✅ Simplified deployment — no external dependencies required.

---

### ⚠️ Challenge 2: API Gateway CORS Blocked My Amplify Site

**Issue:** After moving my frontend from S3 to **AWS Amplify** (for HTTPS and CI/CD), browser requests failed with:

```plaintext
Access blocked by CORS policy
```

**Root Cause:**  
Lambda and API Gateway were still configured with the *old S3 origin* in the CORS settings.

**Fix:**  
Updated the environment variable in CloudFormation:

```plaintext
ALLOWED_ORIGIN: "https://infra-dev-setup.d3ue8qsbe8o03n.amplifyapp.com"
```

Redeployed via GitHub Actions — fixed instantly.

✅ My Amplify-hosted HTTPS frontend could now securely call the API.

---

### ⚠️ Challenge 3: DynamoDB Data Going to Old Table

**Issue:** Form submissions appeared in an outdated DynamoDB table.

**Root Cause:** Lambda’s `DYNAMODB_TABLE_NAME` variable still pointed to the previous table created by an older stack.

**Fix:** Updated CloudFormation to link the correct table dynamically:

```plaintext
DYNAMODB_TABLE_NAME: !Ref MyDynamoDBTable
```

and versioned Lambda artifact (`dev-lambda-function-code-v3.zip`).

✅ Backend now wrote data to the latest DynamoDB table.

---

### ⚠️ Challenge 4: Amplify Cached My Old Resume (QR Code Not Updating)

**Issue:** After uploading a new resume PDF with a fresh QR code, the site still served the old file.

**Root Cause:** CloudFront (used by Amplify) was serving cached versions of static files.

**Fix:**  
Renamed the file (`Raseef_Cloud_CV_v2.pdf`) and updated the link in HTML.

✅ Instantly reflected new content and avoided CDN cache lag.

> 💡 Pro Tip: Use versioned filenames or `?v=2` query parameters for cache-busting.

---

### ⚠️ Challenge 5: Two Public Frontends (S3 vs Amplify)

**Issue:** Both the old S3 static endpoint (HTTP) and the new Amplify site (HTTPS) were live.

**Root Cause:** S3’s static website hosting was still enabled.

**Fix:**  
Disabled **Static Website Hosting** in S3 properties but retained the bucket for deployment artifacts.

✅ Single, secure entry point: Amplify HTTPS URL only.

---

### ⚙️ Challenge 6: CI/CD Sync Issues

**Issue:** Sometimes new Lambda updates weren’t reflecting even after successful GitHub Actions runs.

**Root Cause:** CloudFormation didn’t redeploy Lambda when the S3 artifact key remained unchanged.

**Fix:** Incremented artifact names per deployment (`v2`, `v3`, etc.), forcing CloudFormation to detect updates.

✅ Reliable, versioned Lambda deployments every time.

---

## 🧠 Final Takeaways — From Cloud Engineer to DevOps Thinker

| Lesson | Description |
| --- | --- |
| **Automate but verify** | IaC doesn’t just deploy — it reveals dependencies and mistakes you didn’t see manually. |
| **Version your deployments** | Both backend (Lambda) and frontend (Amplify) rely on cache/version detection. |
| **Own your CORS** | CORS issues are inevitable; environment-specific origins are the best fix. |
| **HTTPS and security first** | Amplify gives HTTPS by default — always prefer it over public S3 sites. |
| **CI/CD is a mindset** | Every pipeline is a living system — monitor, iterate, improve. |

---

### 💡 Closing Reflection — Ask Why, Build How

Looking back, this wasn’t just a portfolio project.  
It became a *miniature production system* — built, broken, and rebuilt by me.

Every “error” was a disguised lesson in architecture, automation, or patience.  
Every challenge forced me to think one layer deeper — about how things connect and why they fail.

> “Ask Why, Build How.”  
> Because understanding *why* something matters makes the *how* meaningful.

---

### 🔗 Live Demo

**Portfolio (AWS CloudFront):**  
[https://d3svccsjj104ji.cloudfront.net/](https://d3svccsjj104ji.cloudfront.net/)

---

### 🏁 **Stack Summary**

🧩 **AWS Services**  
AWS Amplify · S3 · API Gateway · Lambda · DynamoDB · SNS · CloudFormation · IAM · CloudWatch

⚙️ **CI/CD Pipeline**  
GitHub Actions · GitHub Workflow · OIDC Authentication

🧠 **Version Control**  
Git · GitHub

🎨 **Frontend Stack**  
HTML5 · Tailwind CSS · JavaScript (Vanilla)