# Data Structure Audit & Missing Links

## ✅ FIXED ISSUES

### 1. **Attack Vectors Now Clickable**
- Changed from plain text to clickable buttons
- Shows "→ Click to expand" hint
- Ready for inline expansion (not navigation)

### 2. **New Attack Files Created**
- ✅ XSS (Cross-Site Scripting) - with 3 types, attack steps, defenses
- ✅ CSRF (Cross-Site Request Forgery) - with example payload, defenses
- ✅ MITM (Man-in-the-Middle) - with 5 techniques, tools, defenses

### 3. **New Defense Files Created**
- ✅ IDS/IPS - with 4 types, detection methods, deployment locations
- ✅ VPN - with 4 types, 5 protocols, benefits/limitations

### 4. **Updated References**
- HTTP now only references attacks/defenses that exist
- Categories updated with new attacks and defenses
- FILE_MAP updated with all new files

---

## 📊 CURRENT DATA STRUCTURE

### Categories (8 total)
1. **Networking** → osi-model, tcp-ip-model
2. **OSI Layers** → layer7, layer6, layer4, layer3, layer2, layer1
3. **Protocols** → http, dns, ssh, tcp, udp, tls, ipv4, arp, bgp, ospf, ethernet
4. **Hardware** → nic, cables, wireless
5. **Cybersecurity** → attacks, defenses, tools
6. **Attacks** → arp-spoofing, syn-flood, dns-poisoning, xss, csrf, mitm (6 total)
7. **Defenses** → firewall, zero-trust, ids-ips, vpn (4 total)
8. **Tools** → wireshark, nmap (2 total)

---

## ⚠️ BROKEN LINKS (References to Non-Existent Files)

### OSI Model References
- ❌ `layer5-session` - Referenced but file doesn't exist

### HTTP References
- ✅ Fixed - removed all broken references

### ARP References
- ❌ `mitm` - NOW EXISTS ✅
- ❌ `mac-addresses` - concept file doesn't exist
- ❌ `switching` - concept file doesn't exist
- ❌ `dhcp-snooping` - concept file doesn't exist

### ARP Spoofing Defenses Array
Contains detailed defense objects (not just IDs), so these are NOT broken links:
- Dynamic ARP Inspection (DAI)
- DHCP Snooping
- Static ARP Entries
- 802.1X Port Authentication
- XArp / ARPwatch
- Encrypted Protocols

### TCP References
- ❌ `ports` - concept file doesn't exist
- ❌ `congestion-control` - concept file doesn't exist
- ❌ `flow-control` - concept file doesn't exist

### TLS References
- ❌ `certificates` - concept file doesn't exist
- ❌ `cipher-suites` - concept file doesn't exist
- ❌ `pki` - concept file doesn't exist

### DNS References
- ❌ `dns-cache` - concept file doesn't exist
- ❌ `dns-hierarchy` - concept file doesn't exist
- ❌ `root-servers` - concept file doesn't exist

### XSS References
- ❌ `session-hijacking` - attack file doesn't exist
- ❌ `csp` - defense file doesn't exist
- ❌ `same-origin-policy` - concept file doesn't exist

### CSRF References
- ❌ `session-management` - concept file doesn't exist
- ❌ `cookies` - concept file doesn't exist
- ❌ `same-origin-policy` - concept file doesn't exist

### MITM References
- ✅ `arp-spoofing` - EXISTS
- ✅ `dns-poisoning` - EXISTS
- ✅ `tls` - EXISTS
- ❌ `ssl-stripping` - attack file doesn't exist
- ✅ `vpn` - NOW EXISTS ✅
- ❌ `hsts` - defense file doesn't exist

### IDS/IPS References
- ✅ `firewall` - EXISTS
- ❌ `siem` - defense file doesn't exist
- ❌ `network-monitoring` - concept file doesn't exist
- ❌ `threat-detection` - concept file doesn't exist

### VPN References
- ❌ `encryption` - concept file doesn't exist
- ✅ `tls` - EXISTS
- ❌ `ipsec` - protocol file doesn't exist
- ❌ `wireguard` - protocol file doesn't exist
- ✅ `mitm` - NOW EXISTS ✅
- ❌ `public-wifi` - concept file doesn't exist

---

## 🎯 PRIORITY FIXES

### High Priority - Create These Files

1. **Layer 5 (Session)**
   - File: `public/data/osi/layer5-session/layer5-session.json`
   - Add to OSI layers category

2. **Common Concepts**
   - `mac-addresses.json` - What MAC addresses are, format, OUI
   - `cookies.json` - HTTP cookies, session management
   - `encryption.json` - Symmetric vs asymmetric, algorithms
   - `certificates.json` - X.509, CA, certificate chain

3. **Missing Protocols**
   - `https.json` - HTTP over TLS, port 443
   - `icmp.json` - Ping, traceroute, error messages
   - `dhcp.json` - Dynamic IP assignment
   - `ipv6.json` - 128-bit addresses, features

4. **Missing Attacks**
   - `ssl-stripping.json` - Downgrade HTTPS to HTTP
   - `session-hijacking.json` - Steal session tokens
   - `ddos.json` - Distributed Denial of Service

5. **Missing Defenses**
   - `waf.json` - Web Application Firewall
   - `hsts.json` - HTTP Strict Transport Security
   - `csp.json` - Content Security Policy
   - `siem.json` - Security Information and Event Management

### Medium Priority

6. **Hardware**
   - `router.json` - Layer 3 device
   - `switch.json` - Layer 2 device
   - `modem.json` - Modulation/demodulation

7. **Concepts**
   - `nat.json` - Network Address Translation
   - `vlan.json` - Virtual LANs
   - `subnetting-guide.json` - How to subnet
   - `osi-vs-tcpip.json` - Model comparison

---

## 🔧 HOW TO FIX BROKEN LINKS

### Option 1: Create the Missing Files
For each broken link, create a JSON file following the DataNode structure.

Example for `mac-addresses.json`:
```json
{
  "id": "mac-addresses",
  "title": "MAC Addresses",
  "type": "concept",
  "osiLayer": 2,
  "description": "48-bit hardware addresses burned into network interface cards",
  "fullExplanation": "...",
  "keyFacts": [...],
  "parent": "layer2-datalink",
  "relatedConcepts": ["ethernet", "arp", "switching"],
  "visualization": { "color": "#ffcc00", "icon": "🏷️", "nodeType": "leaf" }
}
```

Then add to FILE_MAP:
```typescript
'mac-addresses': '/data/concepts/mac-addresses.json',
```

### Option 2: Remove Broken References
Update existing files to remove references to non-existent files.

Example - remove from ARP:
```json
"relatedConcepts": ["ethernet", "switching"]  // removed mac-addresses, dhcp-snooping
```

---

## 📈 DATA COMPLETENESS

| Category | Files | Broken Links | Completeness |
|----------|-------|--------------|--------------|
| OSI Layers | 6/7 | 1 (layer5) | 85% |
| Protocols | 11 | ~15 | 40% |
| Hardware | 3 | ~7 | 30% |
| Attacks | 6 | ~5 | 55% |
| Defenses | 4 | ~6 | 40% |
| Tools | 2 | ~3 | 40% |
| Concepts | 0 | ~20 | 0% |

**Overall**: ~45% complete with proper linking

---

## ✅ NEXT STEPS

1. **Create Layer 5 (Session)** - Complete OSI model
2. **Create common concepts** - mac-addresses, cookies, encryption, certificates
3. **Create missing protocols** - HTTPS, ICMP, DHCP, IPv6
4. **Create missing attacks** - SSL stripping, session hijacking, DDoS
5. **Create missing defenses** - WAF, HSTS, CSP, SIEM
6. **Clean up broken references** - Remove or create missing links
7. **Add hardware** - Router, Switch, Modem
8. **Test all links** - Click through every reference to verify

---

## 🎨 UI IMPROVEMENT NEEDED

Currently, clicking attack/defense names does nothing. Need to implement:

1. **Inline Expansion** - Click attack name → expand details below (accordion style)
2. **Modal/Drawer** - Click attack name → open side panel with details
3. **Tooltip** - Hover over attack name → show brief description

**Recommended**: Accordion-style expansion (like OSINT Framework)
- Click "xss" → expands to show description, types, defenses
- Click again → collapses
- No navigation, stays on same page
