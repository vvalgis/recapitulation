build:
	@sh ./build.sh
	@echo 'Built'

watch:
	@sh ./watch.sh './' '*.js' 'make build'
