npm run build
aws s3 sync dist s3://mateus-bookreport-v3-test-vue --delete
aws cloudfront create-invalidation --distribution-id E3TX7U0Z5AXA28 --paths "/*"