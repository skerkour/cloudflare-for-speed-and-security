.PHONY: install_ci
install_ci:
	npm ci --no-scripts --ignore-scripts


.PHONY: deploy
deploy:
	cd phoenix-api && npm run deploy
	cd phoenix-blog && npm run deploy
	cd phoenix-webapp && npm run deploy
