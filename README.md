# Photography Gallery

A modern, responsive web-based photography gallery application designed to showcase your best work with style and elegance.

## Features

- 🖼️ **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Beautiful UI** - Clean and intuitive user interface
- ⚡ **Fast Loading** - Optimized image loading and caching
- 🔍 **Image Lightbox** - Full-screen image viewing with smooth transitions
- 🏷️ **Category Filtering** - Organize photos by categories
- 📱 **Mobile Friendly** - Touch-friendly controls for mobile devices
- 🌙 **Dark Mode** - Optional dark theme support
- 📊 **Gallery Analytics** - Track gallery views and engagement

## Project Structure

```
photography-gallery/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css         # Main stylesheet
│   └── responsive.css     # Responsive design styles
├── js/
│   ├── gallery.js         # Gallery functionality
│   ├── lightbox.js        # Lightbox modal
│   └── utils.js           # Utility functions
├── images/
│   ├── gallery/           # Gallery images
│   └── icons/             # UI icons
├── README.md              # This file
└── .gitignore            # Git ignore file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript
- Node.js (optional, for local development server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dngt12/photography-gallery.git
   cd photography-gallery
   ```

2. **Open in your browser**
   - Simply open `index.html` in your web browser, or
   - Use a local development server:
   ```bash
   npx http-server
   # or
   python -m http.server 8000
   ```

3. **Access the gallery**
   - Open `http://localhost:8000` in your browser

## Usage

### Adding Images

1. Place your images in the `images/gallery/` directory
2. Update the `js/gallery.js` file with image references:
   ```javascript
   const galleryItems = [
     {
       id: 1,
       title: 'Image Title',
       description: 'Image description',
       category: 'landscape',
       image: 'images/gallery/image-name.jpg',
       thumbnail: 'images/gallery/thumbs/image-name-thumb.jpg'
     },
     // Add more items...
   ];
   ```

### Customization

- **Colors**: Edit `css/styles.css` to customize the color scheme
- **Layout**: Modify grid settings in `css/responsive.css`
- **Functionality**: Update `js/gallery.js` for custom behavior

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Images are optimized for web (compressed and properly sized)
- Lazy loading enabled for off-screen images
- CSS and JavaScript are minified in production
- Caching strategies implemented for repeated visits

## Features Documentation

### Lightbox
Click any image to open the lightbox view. Navigate using:
- Arrow keys or arrow buttons for next/previous
- Esc key to close
- Touch swipe on mobile devices

### Filtering
Use the category filter buttons to view specific photo collections:
- All (displays all photos)
- Landscape
- Portrait
- Abstract
- Other (custom categories)

### Search
Search photos by title or description using the search bar.

## Development

### Local Setup

```bash
# Install dependencies (if using build tools)
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### File Conventions

- Use camelCase for JavaScript variables and functions
- Use kebab-case for CSS classes
- Keep image files under 500KB
- Use descriptive file and folder names

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select main branch as source
4. Your gallery will be live at `https://dngt12.github.io/photography-gallery`

### Traditional Hosting

Upload all files to your web server via FTP or file manager.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

**Images not loading?**
- Check the image paths in `gallery.js`
- Ensure images exist in the correct directory
- Clear browser cache and reload

**Lightbox not working?**
- Verify `lightbox.js` is properly linked in `index.html`
- Check browser console for JavaScript errors

**Responsive design issues?**
- Clear browser cache
- Test in a different browser
- Check viewport meta tag in HTML

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspiration from modern photography portfolio sites
- Community feedback and contributions
- Open-source libraries and tools

## Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: dngt12

## Changelog

### Version 1.0.0 (2026-01-14)
- Initial release
- Core gallery functionality
- Lightbox feature
- Category filtering
- Responsive design
- Mobile support

---

**Last Updated**: 2026-01-14

Happy sharing! 📸✨
