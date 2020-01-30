.PHONY: install
install: 
	aws s3 cp static s3://lunch-static --recursive --exclude "*" --include "*.html" --include "*.css"