terraform {
  required_version = ">=1.5.7"

  required_providers {
    ds4 = {
      source = "terraform-registry.internal.hosted.snplow.net/snowplow-devops/ds4"
    }
  }
}

variable "msc_org_id" {
  type = string
}

variable "msc_api_key_id" {
  type      = string
  sensitive = true
  default   = null
}

variable "msc_api_key" {
  type      = string
  sensitive = true
  default   = null
}

variable "snowplow_api_url" {
  type = string
}

variable "signals_demo_api_env" {
  type    = string
  default = "snowplow-website-signals-demo"
}

variable "client_name" {
  type    = string
  default = "aws_sandbox"
}

locals {
  config_map = {
    aws_sandbox = {
      aws_setup_env_name             = "dev1"
      aws_eks_cluster_env_name       = "dev1"
      aws_container_monitor_env_name = "dev1"
      aws_metrics_relay_env_name     = "dev1"
    }
  }
  account_cfg = lookup(local.config_map, var.client_name, local.config_map["aws_sandbox"])
}

provider "ds4" {
  # URL can be set with 'DS4_URL' on your environment instead.
  url = "https://deployment-service.snplow.net"

  msc_org_id     = var.msc_org_id
  msc_api_key_id = var.msc_api_key_id
  msc_api_key    = var.msc_api_key
}

data "ds4_aws_setup" "dev1" {
  client_name = "aws_sandbox"
  env_name    = "dev1"
}

data "ds4_aws_eks_namespace" "dev1" {
  client_name = "aws_sandbox"
  env_name    = "dev1"
}

data "ds4_aws_eks_cluster" "dev1" {
  client_name = var.client_name
  env_name    = lookup(local.account_cfg, "aws_eks_cluster_env_name")
}

data "ds4_aws_container_monitor" "default" {
  client_name = var.client_name
  env_name    = lookup(local.account_cfg, "aws_container_monitor_env_name")
}

data "ds4_aws_metrics_relay" "default" {
  client_name = var.client_name
  env_name    = lookup(local.account_cfg, "aws_metrics_relay_env_name")
}

resource "ds4_aws_eks_namespace" "default" {
  client_name   = var.client_name
  stack_version = "1.0.0"
  env_name      = var.signals_demo_api_env

  deps_aws_setup_env       = data.ds4_aws_setup.dev1.env_name
  deps_aws_eks_cluster_env = data.ds4_aws_eks_cluster.dev1.env_name
}


resource "ds4_aws_service" "web_demo_api" {
  client_name   = var.client_name
  stack_version = "0.1.0"
  env_name      = "web-demo-api"

  deps_aws_setup_env             = data.ds4_aws_setup.dev1.env_name
  deps_aws_eks_namespace_env     = ds4_aws_eks_namespace.default.env_name
  deps_aws_container_monitor_env = data.ds4_aws_container_monitor.default.env_name
  deps_aws_metrics_relay_env     = data.ds4_aws_metrics_relay.default.env_name

  iam_permissions_boundary = data.ds4_aws_setup.dev1.outputs.iam_permissions_boundary

  app_deploy_service_ingress = true
  app_service_ingress_port   = 8000

  app_image_repository = "snowplow/snowplow-signals-website-demo"
  app_image_tag        = "0.1.0rc1"

  app_config_env_vars = jsonencode({
    "SNOWPLOW_API_URL"    = var.snowplow_api_url
    "SNOWPLOW_API_KEY_ID" = var.msc_api_key_id
    "SNOWPLOW_API_KEY"    = var.msc_api_key
    "SNOWPLOW_ORG_ID"     = var.msc_org_id
  })

}
