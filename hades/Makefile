default: hades-x64-linux hades-x64-darwin

hades-x64-darwin: hades.go
	GOOS=darwin GOARCH=amd64 go build -o hades-x64-darwin $<

hades-x64-linux: hades.go
	GOOS=linux GOARCH=amd64 go build -o $@ $<

.PHONY: default
