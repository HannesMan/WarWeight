function countBuildingsWithName(buildings, name) {
  return buildings.filter(b => b.name === name).length;
}

function formatCheckboxLabel(building, allBuildings) {
  const countSameName = countBuildingsWithName(allBuildings, building.name);
  const indexPart = countSameName > 1 && 'index' in building ? ` #${building.index}` : '';

  let levelStr = '';
  if (building.level) {
    levelStr = `Level ${building.level}`;
  } else if (building.builtLevel) {
    levelStr = `Built Level ${building.builtLevel}`;
  }

  return `${building.name}${indexPart} ${levelStr}`.trim();
}

function formatEmbedLine(building, idx, allBuildings) {
  const countSameName = countBuildingsWithName(allBuildings, building.name);
  const indexPart = countSameName > 1 && 'index' in building ? ` #${building.index}` : '';

  let levelStr = '';
  if (building.level) {
    levelStr = `Level ${building.level}`;
  } else if (building.builtLevel) {
    levelStr = `Built Level ${building.builtLevel}`;
  }

  return `${idx + 1}. ${building.name}${indexPart} ${levelStr}`.trim();
}

function createCheckboxListWithAll(id, allBuildings) {
  const container = document.createElement('div');
  container.className = 'checkbox-list';
  container.id = id;

  // Lasketaan kuinka monta rakennusta kutakin nimeä on
  const nameCounts = allBuildings.reduce((acc, b) => {
    acc[b.name] = (acc[b.name] || 0) + 1;
    return acc;
  }, {});

  // Säilytetään viitteet All-checkboxeihin ja yksittäisiin checkboxeihin
  const allCheckboxes = {}; // { name: allCheckboxElement }
  const singleCheckboxes = []; // { checkbox, buildingName }

  allBuildings.forEach((building, i) => {
    const name = building.name;
    const hasMultiple = nameCounts[name] > 1;

    // Jos on useampi ja All-checkboxia ei vielä ole, lisätään se juuri ennen ensimmäistä tämän nimistä rakennusta
    if (hasMultiple && !allCheckboxes[name]) {
      // Luo All-checkboxin div
      const allDiv = document.createElement('div');
      allDiv.style.display = 'flex';
      allDiv.style.alignItems = 'center';
      allDiv.style.gap = '0.3em';
      allDiv.style.marginBottom = '0.2em';

      const allChk = document.createElement('input');
      allChk.type = 'checkbox';
      allChk.id = `chk-all-${name.replace(/\s+/g, '-')}`;
      allChk.dataset.name = name;

      const allLabel = document.createElement('label');
      allLabel.htmlFor = allChk.id;
      allLabel.textContent = `All ${name}`;

      allDiv.appendChild(allChk);
      allDiv.appendChild(allLabel);

      container.appendChild(allDiv);

      allCheckboxes[name] = allChk;

      // Event listener: kun All-checkbox muuttuu, ruksaataan/poistetaan ruksaus kaikista samaa nimeä olevista yksittäisistä
      allChk.addEventListener('change', () => {
        const checked = allChk.checked;
        singleCheckboxes.forEach(({ checkbox, buildingName }) => {
          if (buildingName === name) {
            checkbox.checked = checked;
            // Triggeröi yksittäisen checkboxin change-eventti, jotta päivitykset tapahtuu oikein
            checkbox.dispatchEvent(new Event('change'));
          }
        });
      });
    }

    // Lisätään yksittäinen checkbox
    const item = document.createElement('div');
    item.className = 'checkbox-item';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '0.5em';
    item.style.marginLeft = '1.5em'; // Sisennys

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `chk-${i}`;
    checkbox.value = i;

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = formatCheckboxLabel(building, allBuildings);

    item.appendChild(checkbox);
    item.appendChild(label);
    container.appendChild(item);

    singleCheckboxes.push({ checkbox, buildingName: name });

    // Kun yksittäinen checkbox muuttuu, tarkistetaan pitääkö All-checkbox ruksaista
    checkbox.addEventListener('change', () => {
      const allChk = allCheckboxes[name];
      if (!allChk) return;

      // Onko kaikki saman nimiset yksittäiset checkboxit ruksaistu?
      const allChecked = singleCheckboxes
        .filter(sc => sc.buildingName === name)
        .every(sc => sc.checkbox.checked);

      // Päivitetään All-checkbox tämän mukaan, mutta ei triggeröidä tapahtumaa uudelleen
      if (allChk.checked !== allChecked) {
        allChk.checked = allChecked;
      }
    });
  });

  return container;
}

function updateBuildings(thKey, buildingsContainer, calculateBtn, warWeightData) {
  buildingsContainer.innerHTML = '';
  calculateBtn.disabled = true;

  if (!thKey || !warWeightData[thKey]) return null;

  const allBuildings = warWeightData[thKey];

  const label = document.createElement('label');
  label.textContent = 'Select completed upgrades:';
  buildingsContainer.appendChild(label);

  const list = createCheckboxListWithAll('checkbox-list', allBuildings);
  buildingsContainer.appendChild(list);

  calculateBtn.disabled = false;

  return allBuildings;
}

function calculateNextUpgrades(selectedTH, warWeightData, updatesContainer) {
  if (!selectedTH) {
    updatesContainer.textContent = 'Please select a Town Hall level first.';
    return;
  }

  const allBuildings = warWeightData[selectedTH];
  if (!allBuildings) {
    updatesContainer.textContent = 'Data for selected Town Hall not loaded yet.';
    return;
  }

  const checkedIndexes = new Set();
  const list = document.getElementById('checkbox-list');
  if (list) {
    const checkedBoxes = list.querySelectorAll('input[type=checkbox]:checked');
    checkedBoxes.forEach(chk => {
      // All-checkboxeilla ei ole value-attribuuttia, joten tarkistetaan että value ei ole tyhjä
      if (chk.value !== '') {
        checkedIndexes.add(parseInt(chk.value));
      }
    });
  }

  let remaining = allBuildings
    .map((b, i) => ({ ...b, _index: i }))
    .filter(b => !checkedIndexes.has(b._index));

  remaining = remaining.filter(b => {
    if (b.requiresBuiltLevel1) {
      const built = allBuildings.find(other =>
        other.name === b.name &&
        other.builtLevel === 1 &&
        ('index' in b ? other.index === b.index : true)
      );
      if (!built) return false;
      const builtIndex = allBuildings.indexOf(built);
      return checkedIndexes.has(builtIndex);
    }
    return true;
  });

  const nextUpgrades = remaining.slice(0, 6);

  if (nextUpgrades.length === 0) {
    updatesContainer.textContent = '✅ You are ready to move to the next Town Hall!';
    return;
  }

  updatesContainer.textContent = nextUpgrades.map((b, idx) => formatEmbedLine(b, idx, nextUpgrades)).join('\n');
}
