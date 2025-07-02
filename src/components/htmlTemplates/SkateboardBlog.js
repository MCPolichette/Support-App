const skateboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Wanderlust & Wi-Fi</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      background: #fffaf5;
      margin: 0;
      color: #333;
    }
    header {
      background: #4b2e83;
      color: white;
      padding: 2rem;
      text-align: center;
    }
    main {
      display: flex;
      gap: 2rem;
      padding: 2rem;
    }
    .content {
      flex: 3;
    }
    .sidebar {
      flex: 1;
      background: #f8f0e3;
      padding: 1rem;
      border-left: 2px dashed #ccc;
    }
    article {
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    h2 {
      color: #4b2e83;
    }
    .ad {
      border: 1px solid #aaa;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #fff;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
    }
    a {
      color: #4b2e83;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <header>
    <h1>✈️ Wanderlust & Wi-Fi</h1>
    <p>Globe-trotting adventures with just one bar of signal</p>
  </header>
  <main>
    <div class="content">
      <article>
        <h2>Review: CloudSurf Airlines Economy “Nap Pod”</h2>
        <p>Ever flown through a thunderstorm in a glorified bean bag? We did. Here's our full review of CloudSurf's new "Nap Pod" seating class.</p>
        <a href="#">Read more →</a>
      </article>
      <article>
        <h2>Hidden Gem: Sand-Dune Jazz Club in Outer Tunisia</h2>
        <p>We found live Miles Davis covers under the stars, 40 km from anywhere. No menu, no map. But somehow they had Wi-Fi.</p>
        <a href="#">Read more →</a>
      </article>
      <article>
        <h2>We Ate All the Street Corn in Mexico City (Again)</h2>
        <p>Round 3. We're not proud of it. But here's our 2025 ranking of every cart from Roma Norte to Coyoacán.</p>
        <a href="#">View Rankings →</a>
      </article>
    </div>
    <aside class="sidebar">
      <div class="ad">[Ad Slot: Rent a GoPro With Bitcoin]</div>
      <div class="ad">[Ad Slot: VPN for Nomads – 92% Off]</div>
      <div class="ad">[Ad Slot: Sandproof Keyboard Giveaway]</div>
    </aside>
  </main>
</body>
</html>
`;
export default skateboardHTML;
