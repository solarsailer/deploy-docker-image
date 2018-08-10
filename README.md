# deploy-docker-image

Deploy a Docker image to a server, the simple way.

## Why

The goal is to have a simple server which runs docker images, and that's all. **The server is pretty barebone: it only has docker.**

This is a super simple way to deploy mini-apps on the same server, without installing dependencies and mixing everything.

## What it does

1. Save an image as tarball.
2. Sync this image to a remote location.
3. Run this image (and clean a previous one).
