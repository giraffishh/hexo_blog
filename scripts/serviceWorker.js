hexo.extend.filter.register('after_generate', () => {
  const fs = require('fs');
  const path = require('path');
  const swTemplatePath = path.join(hexo.base_dir, 'source', 'serviceWorker-template.js');
  const swOutputDir = hexo.public_dir;
  const swOutputPath = path.join(swOutputDir, 'serviceWorker.js');

  // Generate a unique version number
  const version = new Date().getTime();

  // Read the template file content
  let swContent = fs.readFileSync(swTemplatePath, 'utf8');

  // Replace the placeholder with the actual version number
  swContent = swContent.replace('__CACHE_VERSION__', `v${version}`);

  // Ensure the public directory exists
  if (!fs.existsSync(swOutputDir)){
    fs.mkdirSync(swOutputDir, { recursive: true });
  }

  // Write the final serviceWorker.js file
  fs.writeFileSync(swOutputPath, swContent);
});