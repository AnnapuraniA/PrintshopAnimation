# 🎨 CraftPrint - Interactive 3D Printing Experience

![CraftPrint Logo](./public/placeholder.svg)

An immersive 3D web experience showcasing custom printing services through an interactive animation. Watch as customers bring their items to our craftsman, who brings their designs to life using our state-of-the-art printing technology.

## ✨ Features

### 🎬 Interactive 3D Animation
- **Human-like Characters**: Detailed 3D models of customers and craftsman with realistic animations
- **Multiple Products**: Bottles, t-shirts, pillows, and cups with plain and printed states
- **Complete Workflow**: Full printing process from customer arrival to product delivery
- **Smooth Transitions**: Seamless object handoffs and movements
- **Dynamic Colors**: Customer shirt color changes based on the item they bring

### 🎵 Sound Effects
- Procedurally generated audio using Web Audio API
- Footstep sounds during customer movement
- Whoosh sounds for object transfers
- Mechanical printing machine sounds
- Success chime when receiving printed items
- Mute/unmute toggle button

### 🎭 Visual Effects
- Particle effects during printing
- Workshop environment with props (shelves, tools, lamps)
- Dynamic lighting system
- Atmospheric dust particles
- Smooth camera controls

### 📱 Responsive Design
- Optimized for desktop and mobile devices
- Touch-friendly controls
- Performance-optimized for lower-end devices

### 🚀 Loading Experience
- Beautiful animated loading screen
- Logo and company name zoom animation
- Smooth transition to main scene

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Three Fiber** - 3D rendering with Three.js
- **React Three Drei** - Useful Three.js helpers
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Web Audio API** - Sound effects

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd craftprint-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the app in action.

## 🏗️ Project Structure

```
craftprint-website/
├── src/
│   ├── components/
│   │   ├── Client3D.tsx           # 3D customer character
│   │   ├── Craftsman3D.tsx        # 3D craftsman character
│   │   ├── PrintingMachine3D.tsx  # 3D printing machine
│   │   ├── PrintableObject3D.tsx  # 3D printable items
│   │   ├── PrintingParticles.tsx  # Particle effects
│   │   ├── WorkshopEnvironment.tsx # Background scene
│   │   ├── PrintingScene.tsx      # Main scene orchestration
│   │   ├── LoadingIntro.tsx       # Loading animation
│   │   ├── Header.tsx             # Header component
│   │   └── Footer.tsx             # Footer component
│   ├── pages/
│   │   └── Index.tsx              # Main page
│   ├── utils/
│   │   └── soundEffects.ts        # Sound effects manager
│   ├── App.tsx                    # App root
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind configuration
└── package.json                   # Dependencies
```

## 🎮 Usage

### Animation Phases

The animation runs in a continuous loop with 7 phases:

1. **Client Entering** - Customer walks in with an item
2. **Client to Craftsman** - Object handed to craftsman
3. **Craftsman to Machine** - Object placed in printing machine
4. **Printing** - Machine prints design on object (3 seconds)
5. **Machine to Craftsman** - Craftsman retrieves printed object
6. **Craftsman to Client** - Printed object returned to customer
7. **Client Leaving** - Happy customer leaves with printed item

### Controls

- **Mouse/Touch Drag**: Rotate camera view
- **Mouse Wheel**: Zoom in/out (desktop only)
- **Sound Button**: Toggle sound effects on/off (bottom-right corner)

## 🚀 Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build outputs to the `dist/` folder.

## 📤 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Self-hosted options

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🎨 Customization

### Colors

The color palette is defined in `src/index.css` using CSS custom properties:

```css
:root {
  --craft-brown: hsl(28, 30%, 18%);
  --craft-orange: hsl(25, 85%, 58%);
  --craft-gold: hsl(45, 95%, 60%);
  --teal-primary: hsl(186, 85%, 35%);
  /* ... more colors */
}
```

### Animation Timing

Adjust timing in `src/components/PrintingScene.tsx`:

```typescript
const timings: Record<ScenePhase, number> = {
  "client-entering": 1500,
  "client-to-craftsman": 1000,
  // ... other phases
};
```

### Adding New Objects

Add new object types in `src/components/PrintableObject3D.tsx` and update the `items` array in `PrintingScene.tsx`.

## 🐛 Troubleshooting

### 3D Scene Not Rendering
- Check browser WebGL support
- Try a different browser (Chrome/Firefox recommended)
- Check console for errors

### Performance Issues
- Disable sound effects
- Use a desktop browser
- Close other tabs/applications

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Update Node.js to 18+

## 📊 Performance

- **Bundle Size**: ~1.28 MB (362 KB gzipped)
- **First Paint**: < 2s on good connection
- **Interactive**: < 3.5s (after loading animation)
- **Frame Rate**: 60 FPS on modern devices

## 🔒 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: WebGL 2.0 required for 3D rendering.

## 📝 License

This project is proprietary. All rights reserved.

## 🤝 Contributing

This is a closed-source project. For bug reports or feature requests, please contact the development team.

## 📞 Contact

- **Website**: [Your Website]
- **Email**: [Your Email]
- **Phone**: [Your Phone]

## 🙏 Acknowledgments

- Three.js community
- React Three Fiber team
- Lovable platform for initial scaffolding

---

**Made with ❤️ by CraftPrint Studio**

🚀 **Ready to deploy?** Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions!
