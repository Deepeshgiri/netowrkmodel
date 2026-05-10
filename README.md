# Network & CyberSec Explorer 🌐

A comprehensive, interactive drill-down explorer for computer networking and cybersecurity concepts. Similar to OSINT Framework, where clicking any topic breaks into sub-parts with full explanations, packet structures, ports, attacks, and defenses.

## 🎯 What We Built

A full-screen explorer application that allows users to:
- **Navigate hierarchically** through networking and cybersecurity topics
- **Drill down** from categories → topics → sub-topics → detailed explanations
- **View comprehensive details** including:
  - Packet/frame structures with header fields
  - Protocol versions and evolution
  - Port numbers and transport protocols
  - Attack vectors and defense mechanisms
  - Related concepts and dependencies
  - Key facts and technical specifications

## 🏗️ Architecture

### Data Structure
- **JSON-based**: All data stored in small, manageable JSON files
- **Organized by category**: `public/data/` with subdirectories:
  - `core/` - OSI model, TCP/IP model
  - `osi/layer{1-7}-*/` - Layer-specific protocols and concepts
  - `cybersecurity/` - Attacks, defenses, tools
  - `hardware/` - Network hardware components
  - `metadata/` - Category definitions

### Key Components

1. **ExplorerView** (`src/components/ExplorerView.tsx`)
   - Main UI component with drill-down navigation
   - Breadcrumb navigation for easy backtracking
   - Responsive card grid layout
   - Animated transitions between views

2. **Data Loader** (`src/data/dataLoader.ts`)
   - FILE_MAP registry mapping IDs to JSON file paths
   - Caching mechanism for performance
   - Helper functions for colors and icons

3. **Type Definitions** (`src/data/types.ts`)
   - DataNode interface for all content nodes
   - CategoryNode interface for top-level categories

## 📊 Data Coverage

### OSI Layers (6 layers)
- Layer 7: Application (HTTP, DNS, SSH)
- Layer 6: Presentation (TLS)
- Layer 4: Transport (TCP, UDP, TCP Handshake)
- Layer 3: Network (IPv4, BGP, OSPF, Subnetting)
- Layer 2: Data Link (Ethernet, ARP)
- Layer 1: Physical (Cables, Wireless)

### Cybersecurity
- **Attacks**: ARP Spoofing, SYN Flood, DNS Poisoning
- **Defenses**: Firewall, Zero Trust
- **Tools**: Wireshark, Nmap

### Hardware
- Network Interface Card (NIC) with components and offloading features

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
netowrkmodel/
├── public/data/           # All JSON data files
│   ├── core/             # OSI & TCP/IP models
│   ├── osi/              # Layer-specific data
│   ├── cybersecurity/    # Attacks, defenses, tools
│   ├── hardware/         # Network hardware
│   └── metadata/         # Categories definition
├── src/
│   ├── components/
│   │   └── ExplorerView.tsx  # Main explorer component
│   ├── data/
│   │   ├── dataLoader.ts     # Data fetching system
│   │   └── types.ts          # TypeScript interfaces
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
└── package.json
```

## 🎨 Features

- **Responsive Design**: Auto-adjusting grid layout for all screen sizes
- **Color-Coded**: Each OSI layer and category has distinct colors
- **Icon System**: Visual icons for quick identification
- **Breadcrumb Navigation**: Easy navigation back through hierarchy
- **Smooth Animations**: Framer Motion for polished transitions
- **Loading States**: Skeleton loaders while fetching data
- **Security Highlights**: Attack vectors and defenses clearly marked

## 🔧 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Zustand** (removed - state managed locally)

## 📝 Adding New Content

1. Create a JSON file in the appropriate directory under `public/data/`
2. Follow the DataNode interface structure
3. Add the file path to FILE_MAP in `dataLoader.ts`
4. Reference the ID in parent node's `children` array
5. Update `categories.json` if adding a new top-level category

## ✅ What We Achieved

✓ Comprehensive drill-down explorer (like OSINT Framework)
✓ JSON-based data architecture with small, manageable files
✓ Full navigation: Home → Category → Node → Sub-nodes → Leaf details
✓ Detailed protocol information with packet structures
✓ Attack vectors and defense mechanisms
✓ Breadcrumb navigation
✓ Responsive design
✓ Clean, minimal codebase
✓ Removed all unused code and components
✓ Successful production build

## 🎯 Future Enhancements

- Add more protocols (ICMP, SMTP, FTP, DHCP, etc.)
- Add more attack techniques and defenses
- Add interactive packet visualizations
- Add search functionality
- Add bookmarking/favorites
- Add dark/light theme toggle
- Add export/share functionality

---

**Built with ❤️ for networking and cybersecurity education**