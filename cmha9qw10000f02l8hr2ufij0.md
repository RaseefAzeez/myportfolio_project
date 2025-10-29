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

# 🧭 My Journey in Cloud: From Curiosity to Cloud Architecture

When I first started working in cloud, I was filled with curiosity. As an outsider, I had always wondered what really happens “in the cloud” — how everything works together behind the scenes.

When I finally got the opportunity to step into this space, my first thought was:

> *“Now that I’m in, what’s next?”*

Since my work was mainly on the infrastructure side, I began exploring different paths to grow further in my cloud career. After researching and reflecting on what truly excites me, I realized that **cloud architecture** aligns perfectly with who I am.

I’ve always been someone who enjoys creating things in my own way, adding a touch of originality and creativity to everything I build. The architectural path felt like the right fit — a space where I could merge structure, logic, and imagination.

---

## 🎯 Building the Foundation — Certifications vs. Real Experience

So, I decided to pursue the **AWS Solutions Architect – Associate (SAA-C03)** certification as the first step toward that goal.

However, after clearing the certification, I quickly realized that **theory and hands-on experience are two very different things.** In interviews, I could explain AWS concepts well, but when scenario-based questions came up — like *“How did you implement this?”* or *“What challenges did you face and how did you solve them?”* — I found myself short of real-world examples.

That moment taught me something important:

> **Certifications prove knowledge, but real projects prove understanding.**

I needed to dive deeper — to build, experiment, and truly *feel* how things work.

---

## ☁️ Designing My First Project — Thinking Like an Architect

That’s when I began designing my own cloud project: a **personal portfolio website**.

I wanted to approach it like an architect — focusing on **cost efficiency**, **scalability**, and **availability**. To keep costs minimal, I used **Amazon S3 static hosting** with a **serverless backend** powered by **API Gateway** and **AWS Lambda**.

Initially, I created all the required resources manually through the **AWS Management Console**, connecting them with **IAM roles**, and later automated deployments using **GitHub Actions** for **CI/CD**.

---

## ⚙️ From Manual Setup to Full Automation — CloudFormation & OIDC

Once my manual workflow was stable, I wanted to go a step further — to **automate the infrastructure creation itself**.

That’s when I introduced **AWS CloudFormation (CFT)** into my setup. I chose **GitHub Actions** for its **simplicity**, **security**, and **reliability** — especially for someone starting out with CI/CD on AWS.

Using **OpenID Connect (OIDC)**, I established a secure, credential-free connection between GitHub and AWS, and built a **fully automated deployment pipeline.**

---

## 🧱 Lessons from Designing with CloudFormation

However, writing CloudFormation templates taught me an even deeper lesson. When you build resources manually in the AWS Console, the UI guides you through each step — helping you pick the next configuration automatically.

But when you write CFT templates yourself, **you’re the architect** — you must think of every dependency, every policy, and every property.

If you create an **S3 bucket**, you must remember to define its **bucket policy** and connect it to the right IAM roles.  
If you deploy a **Lambda function**, you must include its **execution role**, its **permissions**, its **API Gateway integration**, and the **function definition** — every piece depends on your foresight.

Designing CloudFormation templates forced me to think in a broader architectural way — understanding how each AWS service depends on the other and ensuring that the automation works seamlessly from start to finish.

It’s not just about writing YAML; it’s about **thinking like the cloud itself** — secure, scalable, and connected.

---

## 💡 Closing Reflection — Ask Why, Build How

Looking back, this project wasn’t just about hosting a website — it became a reflection of my growth from a **cloud engineer** to someone who thinks like a **solutions architect.**

Each challenge — from configuring IAM roles, integrating CI/CD pipelines, fixing HTTPS issues, to automating with CloudFormation — taught me how **design, automation, and creativity** all come together in the cloud.

And that’s what my journey embodies —

> **Ask Why, Build How.**  
> Because understanding *why* something matters makes the *how* meaningful.