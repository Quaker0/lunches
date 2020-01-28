.PHONY: install
install: 
	aws s3 sync static s3://lunch-static --include "*.html" --include "*.css"