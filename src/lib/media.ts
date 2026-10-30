/** Poster WebP généré à côté de chaque vidéo : /Foo.mp4 -> /posters/Foo.webp */
export function posterFor(videoSrc: string) {
  return videoSrc.replace(/^\/(.+)\.mp4$/, '/posters/$1.webp')
}
