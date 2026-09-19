// Blog posts data — shared by index.html (latest-3 preview) and blog.html (full list).
// title, date and abstract are NOT duplicated here — loadBlogPosts() fetches each
// post's own page and reads them straight from it, so the post page is the single
// source of truth:
//   title    - the post's first <h1>
//   date     - the "YYYY-MM-DD" content of <meta name="date">
//   abstract - the post's opening <p class="lead">
//
// Fields required here (all required):
//   url          - link to the full post, e.g. "blog-posts/my-post.html"
//   previewImage - optional animated/static homepage preview
//   previewAlt   - accessible description for `previewImage`
//
// To publish a new post, either:
//   a) Copy blog-posts/template.html to blog-posts/<your-slug>.html and write the post, or
//   b) Give it its own folder, e.g. blog-posts/<your-slug>/<your-slug>.html, with any images
//      alongside it (e.g. blog-posts/<your-slug>/assets/images/...) — useful for
//      image-heavy posts. Nav links inside it must point back to ../../index.html.
// Make sure the post page has a <meta name="date" content="YYYY-MM-DD">, a top-level
// <h1> with the title you want shown, and a <p class="lead"> with the abstract.
// Then add an entry below pointing `url` at that file.
//
// Example:
// { url: "blog-posts/strong-eventual-consistency.html", previewImage: "blog-posts/strong-eventual-consistency/preview.gif", previewAlt: "..." },

const BLOG_POSTS = [
  { url: "blog-posts/partial-order-reduction/partial-order-reduction.html", previewImage: "blog-posts/partial-order-reduction/assets/images/por-graphical-abstract-handdrawn-color.gif", previewAlt: "Colored hand-drawn animated graphical abstract showing the journey from concurrent systems and interleavings through model checking and partial-order reduction to verified properties." },
];

// Fetches each post's own page and extracts title/date/abstract from it, sorts
// newest-first, and hands the enriched list to `callback`. Posts whose page can't
// be fetched or parsed are skipped.
function loadBlogPosts(callback){
  Promise.all(BLOG_POSTS.map(function(post){
    return fetch(post.url)
      .then(function(res){ return res.ok ? res.text() : null; })
      .then(function(html){
        if(!html) return null;
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var h1 = doc.querySelector('h1');
        var lead = doc.querySelector('p.lead');
        var dateMeta = doc.querySelector('meta[name="date"]');
        if(!h1 || !dateMeta) return null;
        return {
          url: post.url,
          previewImage: post.previewImage,
          previewAlt: post.previewAlt,
          title: h1.textContent.trim(),
          date: dateMeta.getAttribute('content'),
          abstract: lead ? lead.textContent.trim() : ''
        };
      })
      .catch(function(){ return null; });
  })).then(function(results){
    var posts = results.filter(Boolean).sort(function(a, b){ return new Date(b.date) - new Date(a.date); });
    callback(posts);
  });
}
