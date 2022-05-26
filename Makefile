# build:
# 	@sh ./build.sh
# 	@echo 'Built'

# watch:
# 	@sh ./watch.sh './' '*.js' 'make build'

build:
	npm run build:dev

install-deps:
	npm i

build-release: install-deps
	npm run build


### DEPLOY ###
### REMOTE PART ###

RELEASE_NAME:=$$(date +%Y%m%d%H%M%S)
LATEST_RELEASE_NAME?=$$(ls -t releases | head -1)
new-release:
	@mkdir -p releases/$(RELEASE_NAME)
	@echo -n $(RELEASE_NAME)

release:
	@echo $(LATEST_RELEASE_NAME)
	@ln -nfs releases/$(LATEST_RELEASE_NAME) current
	@echo released

clean-old:
	@cd releases && ls -t1 | tail -n +6 | xargs rm -rf --
	@echo cleaned