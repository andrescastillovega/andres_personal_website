#!/bin/bash
git pull origin master
git add .
git commit -m "$1"
git push origin master
cd Models/Wages/

aws s3 cp ./ s3://andrescastillo.co/ --recursive --exclude ".git/*" --exclude "README.md" --exclude "upload_changes.sh" 