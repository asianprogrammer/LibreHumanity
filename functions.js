function inject(jsonData, targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;
  
    // Clear previous content
    container.innerHTML = '';
  
    // Create header section
    const header = document.createElement('div');
    header.className = 'report-header';
    header.innerHTML = `
      <h1 style="center">Data Analysis by using AI</h1>
      <h1>${jsonData.report_meta.title}</h1>
      <div class="meta-info">
        <span>📝 Source: ${jsonData.report_meta.source}</span>
        <span>📆 Period: ${jsonData.report_meta.period}</span>
        <span>🔄 Last Updated: ${jsonData.report_meta.last_updated}</span>
      </div>
    `;
    container.appendChild(header);
  
    // Process sections
    jsonData.sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = `section ${section.type}`;
      
      // Section header
      sectionDiv.innerHTML = `
        <div class="section-header">
          <span class="section-icon">${section.icon}</span>
          <h2>${section.title}</h2>
        </div>
      `;
  
      // Process categories
      if (section.categories) {
        section.categories.forEach(category => {
          const categoryDiv = document.createElement('div');
          categoryDiv.className = 'category';
          categoryDiv.innerHTML = `<h3>${category.label}</h3>`;
          
          category.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'analysis-item';
            itemDiv.innerHTML = `
              <div class="item-header">
                <span class="item-icon">${item.icon}</span>
                <span class="severity-indicator" style="width: ${item.severity * 10}%"></span>
                <strong>${item.text}</strong>
              </div>
              <div class="item-details">
                ${item.comparison ? `<span class="comparison">${item.comparison.benchmark} (${item.comparison.difference})</span>` : ''}
                ${item.implication ? `<p class="implication">${item.implication}</p>` : ''}
              </div>
            `;
            categoryDiv.appendChild(itemDiv);
          });
          sectionDiv.appendChild(categoryDiv);
        });
      }
  
      // Process visual blocks
      if (section.visual_blocks) {
        const visualContainer = document.createElement('div');
        visualContainer.className = 'visual-container';
        section.visual_blocks.forEach(block => {
          const blockDiv = document.createElement('div');
          blockDiv.className = `visual-block ${block.type}`;
          blockDiv.innerHTML = `
            <div class="block-header">${block.label}</div>
            <div class="block-content">
              <div class="current-value">${block.current}</div>
              <div class="benchmark">${block.benchmark}</div>
              <div class="variance ${block.variance.includes('+') ? 'positive' : 'negative'}">${block.variance}</div>
            </div>
          `;
          visualContainer.appendChild(blockDiv);
        });
        sectionDiv.appendChild(visualContainer);
      }
  
      // Process progress bars
      if (section.progress_bars) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        section.progress_bars.forEach(bar => {
          const barDiv = document.createElement('div');
          barDiv.className = 'progress-bar';
          barDiv.innerHTML = `
            <div class="bar-label">${bar.label}</div>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${bar.score * 10}%"></div>
              <div class="bar-status">${bar.status}</div>
            </div>
          `;
          progressContainer.appendChild(barDiv);
        });
        sectionDiv.appendChild(progressContainer);
      }
  
      container.appendChild(sectionDiv);
    });
  
    // Add highlights
    const highlights = document.createElement('div');
    highlights.className = 'highlights';
    highlights.innerHTML = `
      <h2>🚨 Key Highlights</h2>
      <div class="highlight-item shock">${jsonData.highlights.most_shocking}</div>
      <div class="highlight-item urgent">${jsonData.highlights.most_urgent}</div>
      <div class="highlight-item urgent">The particular victim need to become united</div>
      `;
    //   <div class="highlight-item quality">Data Quality: ${jsonData.highlights.data_quality}</div>
    container.appendChild(highlights);
  
    // Add dynamic CSS
    const style = document.createElement('style');
    style.textContent = `
      .center {text-align: center;}
      .report-header { padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 30px; }
      .meta-info { display: flex; gap: 15px; margin-top: 10px; color: #666; }
      .section { padding: 20px; margin: 20px 0; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
      .analysis-item { margin: 15px 0; padding: 15px; border-left: 3px solid #e74c3c; }
      .severity-indicator { height: 4px; background: #2ed573; margin: 5px 0; }
      .visual-block { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px; }
      .progress-bar { margin: 15px 0; }
      .bar-fill { height: 8px; background: #3498db; transition: width 0.3s ease; }
      .highlights { padding: 20px; background: #fff3cd; border-radius: 8px; margin-top: 30px; }
      .highlight-item { margin: 10px 0; padding: 10px; font-weight: bold; }
    `;
    container.appendChild(style);
  }