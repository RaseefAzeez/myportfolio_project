---
title: "RaaS - Reboot As A Service"
datePublished: Tue Dec 30 2025 14:42:17 GMT+0000 (Coordinated Universal Time)
cuid: cmjsp4ps1000402js97fja2kd
slug: raas-reboot-as-a-service
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1767105521643/587f1ff6-a436-4e36-911c-6ec5fde0ebb2.png
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1767105706407/00090871-67b5-4a29-a99d-a3aeb93ad143.png
tags: aws, devops, terraform

---

# 🚀 Built an Enterprise-Grade “Reboot-as-a-Service (RaaS)” Platform Using AWS, Terraform & DevOps Principles

After completing my portfolio website, I wanted my next project to be something more impactful—something that reflects real enterprise challenges. During my research, one common theme kept appearing:  
**Support teams spend a huge amount of time handling repetitive server reboot or connectivity-related tickets.**

In many companies, users must raise a ticket even for basic EC2 troubleshooting. This delays resolution and adds unnecessary load on the admin team.

That insight led me to build **Reboot-as-a-Service (RaaS)**—a self-service platform that allows users to securely view and reboot their EC2 instances without involving support. Implemented well, a system like this can reduce ticket volume by **30% or more**.

---

## 🔧 What I Built

To make the project realistic and enterprise-ready, I used:

### **Cloud Architecture**

• AWS Organizations with separate Business Units (Developers, Support, Admin)  
• IAM Identity Center for structured user/group management  
• API Gateway (HTTPS API)  
• Lambda functions for EC2 lifecycle actions (reboot/start/stop)  
• SNS for email notifications  
• CloudWatch for operational logging  
• S3 backend for Terraform state

### **Infrastructure-as-Code & Automation**

• Fully modular, multi-environment Terraform setup (bootstrap, dev, prod)  
• GitHub Actions CI/CD with **OIDC authentication** (no static AWS credentials)  
• tfvars stored in **GitHub Secrets** to support working across multiple devices  
• Reusable Terraform modules for IAM, API Gateway, and Lambda

---

## 🔐 Authentication Upgrade: From SSO to Cognito

Initially, I explored using AWS IAM Identity Center (SSO) for API authentication.  
However, SSO is built primarily for **console and application access**, not for API Gateway JWT validation.

To deliver a secure and scalable authentication model, I migrated to:

### ✅ **AWS Cognito User Pools**

• Native JWT tokens validated by API Gateway  
• Easy group/attribute mapping  
• ABAC-friendly design for permissions  
• Ideal for user-facing API workloads

This shift made the platform more realistic for internal enterprise APIs.

---

## 🎯 Why I Built RaaS

• To simulate a **real DevOps engineering environment**  
• To practice designing multi-account AWS architectures  
• To reduce manual, repetitive support work through automation  
• To build something that directly mirrors enterprise automation workflows  
• To demonstrate cloud identity, CI/CD, security, and serverless engineering skills in one unified project

---

## 📚 What I Learned

This project strengthened my experience in:

• Cloud security & IAM design  
• Identity-aware API architectures  
• Serverless patterns  
• Terraform module engineering  
• CI/CD with GitHub OIDC  
• Managing multi-environment infrastructure  
• Real-world DevOps workflows

---

If you're building internal tools, DevOps automation, or thinking about strengthening your AWS/Terraform skill set, I highly recommend attempting a project like this. It touches everything—identity, automation, infrastructure design, and cloud operations.

Happy to discuss the architecture or share insights with anyone interested!