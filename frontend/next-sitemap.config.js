/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://theharyanajobalert.com', // <-- replace with your domain
  generateRobotsTxt: true,            // Generates robots.txt too
  sitemapSize: 7000,                  // Optional: splits if > 7000 URLs
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*'],
  additionalPaths: async (config) => {
    const result = [];

    // 1. Posts
    try {
      // Fetch with specific limit to get all posts (adjust limit as needed)
      const res = await fetch('https://backend.theharyanajobalert.com/posts?limit=10000');
      const data = await res.json();
      // Handle paginated response { data: [], meta: {} } or raw array
      const posts = data.data || (Array.isArray(data) ? data : []);

      if (Array.isArray(posts)) {
        posts.forEach((post) => {
          result.push({
            loc: `/posts/${post.slug}`,
            lastmod: post.updated_at || post.created_at || new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.8,
          });
        });
      }
    } catch (error) {
      console.error('Sitemap: Failed to fetch posts', error);
    }

    // 2. Categories
    try {
      const res = await fetch('https://backend.theharyanajobalert.com/categories');
      const categories = await res.json();

      if (Array.isArray(categories)) {
        categories.forEach((category) => {
          if (category.name) {
            const slug = category.name.trim().toLowerCase().replace(/\s+/g, '-');
            result.push({
              loc: `/category/${slug}`,
              lastmod: new Date().toISOString(),
              changefreq: 'daily',
              priority: 0.8,
            });
          }
        });
      }
    } catch (error) {
      console.error('Sitemap: Failed to fetch categories', error);
    }

    // 3. Tags
    try {
      const res = await fetch('https://backend.theharyanajobalert.com/tags');
      const tags = await res.json();

      if (Array.isArray(tags)) {
        tags.forEach((tag) => {
          if (tag.name) {
            const slug = tag.name.trim().toLowerCase().replace(/\s+/g, '-');
            result.push({
              loc: `/tag/${encodeURIComponent(slug)}`,
              lastmod: new Date().toISOString(),
              changefreq: 'weekly',
              priority: 0.6,
            });
          }
        });
      }
    } catch (error) {
      console.error('Sitemap: Failed to fetch tags', error);
    }

    return result;
  },
};
