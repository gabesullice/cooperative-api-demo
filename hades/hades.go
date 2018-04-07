package main

import (
	"flag"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	hades "github.com/gabesullice/hades/lib/server"
)

func main() {
	var backendURL, crt, key, dir string
	flag.StringVar(&backendURL, "backend", "", "The JSON API backend to proxy")
	flag.StringVar(&crt, "crt", "", "The TLS certificate")
	flag.StringVar(&key, "key", "", "The TLS private key")
	flag.StringVar(&dir, "dir", "", "The file directory to serve")
	flag.Parse()
	go func() {
		log.Fatalln(http.ListenAndServe(":80", http.HandlerFunc(redirectHTTPS)))
	}()
	backend := newSingleHostReverseProxy(backendURL)
	mux := http.NewServeMux()
	mux.Handle("demo.sullice.com/", http.FileServer(http.Dir(dir)))
	mux.Handle("demo.sullice.com/http1", serveFile(dir+"/index.html"))
	mux.Handle("demo.sullice.com/http2", serveFile(dir+"/index.html"))
	mux.Handle("http1.sullice.com/", backend)
	mux.Handle("http2.sullice.com/", hades.NewProxy(backend))
	log.Fatalln(http.ListenAndServeTLS(":443", crt, key, mux))
}

func redirectHTTPS(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.URL.RequestURI(), http.StatusPermanentRedirect)
}

func serveFile(filePath string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filePath)
	})
}

func newSingleHostReverseProxy(backendURL string) *httputil.ReverseProxy {
	url, err := url.Parse(backendURL)
	if err != nil {
		log.Fatalln("Could not parse backend URL")
	}
	log.Printf("Started proxy for %v", url)
	backend := httputil.NewSingleHostReverseProxy(url)
	d := backend.Director
	backend.Director = func(r *http.Request) {
		r.Header.Set("X-Forwarded-Proto", "https")
		d(r)
	}
	return backend
}
