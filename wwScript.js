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

function createCheckboxList(id, options) {
  const container = document.createElement('div');
  container.className = 'checkbox-list';
  container.id = id;

  options.forEach(opt => {
    const item = document.createElement('div');
    item.className = 'checkbox-item';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '0.5em';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = opt.id;
    checkbox.value = opt.index;

    const label = document.createElement('label');
    label.htmlFor = opt.id;
    label.textContent = opt.label;

    item.appendChild(checkbox);
    item.appendChild(label);
    container.appendChild(item);
  });

  return container;
}

function updateBuildings(thKey, buildingsContainer, calculateBtn, warWeightData) {
  buildingsContainer.innerHTML = '';
  calculateBtn.disabled = true;

  if (!thKey || !warWeightData[thKey]) return null;

  const allBuildings = warWeightData[thKey];

  const allOptions = allBuildings.map((b, i) => ({
    label: formatCheckboxLabel(b, allBuildings),
    index: i,
    id: `chk-${i}`,
  }));

  const firstBatch = allOptions.slice(0, 25);
  const secondBatch = allOptions.slice(25);

  const label1 = document.createElement('label');
  label1.textContent = 'Select completed upgrades (part 1):';
  buildingsContainer.appendChild(label1);

  const list1 = createCheckboxList('checkbox-list-1', firstBatch);
  buildingsContainer.appendChild(list1);

  if (secondBatch.length > 0) {
    const label2 = document.createElement('label');
    label2.textContent = 'Select completed upgrades (part 2):';
    buildingsContainer.appendChild(label2);

    const list2 = createCheckboxList('checkbox-list-2', secondBatch);
    buildingsContainer.appendChild(list2);
  }

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
  ['checkbox-list-1', 'checkbox-list-2'].forEach(listId => {
    const list = document.getElementById(listId);
    if (!list) return;
    const checkedBoxes = list.querySelectorAll('input[type=checkbox]:checked');
    checkedBoxes.forEach(chk => {
      checkedIndexes.add(parseInt(chk.value));
    });
  });

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
    updatesContainer.textContent = '✅ All upgrades completed!';
    return;
  }

  updatesContainer.textContent = nextUpgrades.map((b, idx) => formatEmbedLine(b, idx, nextUpgrades)).join('\n');
}
