# End-to-End DevOps Pipeline on AWS EKS

A production-grade CI/CD pipeline built with Terraform, GitHub Actions, Docker, and Kubernetes on AWS EKS — using Infrastructure as Code and keyless OIDC authentication instead of stored credentials.

## Architecture

```
Terraform provisions VPC, IAM roles, and EKS cluster
        ↓
Developer pushes code to GitHub
        ↓
GitHub Actions triggers automatically
        ↓
OIDC token generated — no stored AWS credentials
        ↓
AWS IAM Role assumed temporarily (GitHubActionsEKSRole)
        ↓
Docker image built and pushed to Amazon ECR
        ↓
kubectl deploys updated image to EKS cluster
        ↓
3 pods running and verified — credentials expire automatically
```

## Tech Stack

| Technology | Purpose |
|---|---|
| Terraform | Infrastructure as Code — provisions VPC, IAM, EKS cluster, and node groups |
| AWS EKS | Managed Kubernetes cluster |
| AWS ECR | Private Docker image registry |
| GitHub Actions | CI/CD pipeline automation |
| OIDC | Keyless authentication between GitHub and AWS |
| IAM Role | Scoped permissions for pipeline |
| Docker | Application containerization |
| kubectl | Kubernetes deployment management |
| eksctl | EKS cluster provisioning (manual alternative) |

## Key Features

- **Infrastructure as Code** — Entire AWS infrastructure (VPC, subnets, IAM roles, EKS cluster, node groups) defined in Terraform and rebuildable with a single command
- **Keyless authentication** — No AWS access keys stored in GitHub Secrets. Uses OIDC role assumption instead
- **Scoped trust** — IAM role trust policy locked to specific repo and main branch only
- **Automatic deployments** — Every push to main triggers a full build, push, and deploy cycle
- **Self-healing** — EKS maintains 3 running pods at all times via Kubernetes Deployment
- **Disaster recovery** — Infrastructure can be destroyed and rebuilt identically in minutes using `terraform apply`

## Infrastructure Provisioning (Terraform)

1. `terraform init` — downloads AWS provider plugin
2. `terraform plan` — previews infrastructure changes before applying
3. `terraform apply` — provisions VPC, subnets, internet gateway, route tables, IAM roles, EKS cluster, and node groups
4. `terraform destroy` — tears down all infrastructure cleanly

## Pipeline Flow

1. Code pushed to `main` branch
2. GitHub Actions runner starts
3. OIDC token sent to AWS — GitHub identity verified
4. `GitHubActionsEKSRole` assumed temporarily
5. Docker image built and tagged with commit SHA
6. Image pushed to ECR
7. `kubectl set image` updates the EKS deployment
8. Rollout verified — 3/3 pods running

## AWS Services Used

- Amazon EKS — Kubernetes control plane and worker nodes
- Amazon ECR — Private container registry
- AWS IAM — Role-based access control with OIDC federation
- Amazon VPC — Custom networking with public subnets and route tables

## Security Highlights

- OIDC federation eliminates permanent credentials
- IAM role scoped to `umair-javeed/devops-pipeline-eks-argocd` repo only
- `system:masters` group mapped via `aws-auth` ConfigMap
- Temporary credentials expire after each pipeline run
- Terraform state and provider binaries excluded from version control via `.gitignore`
