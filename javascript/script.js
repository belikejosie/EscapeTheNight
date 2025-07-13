class Contestant {
    constructor(name, image = null) {
        this.name = name;

        if (!image || image === "null") {
            this.image = "image/contestants/null.webp";
        } else if (image.startsWith("http") || image.startsWith("data:") || image.includes("/")) {
            this.image = image;
        } else {
            this.image = `image/contestants/${image}.webp`;
        }

        this.isCustom = false;

        this.choice = null;
        this.partner = null;
        this.deathepisode = 0;
        this.relationships = {};
    }

    get displayName() {
        return this.name;
    }

    changeRelationship(otherName, amount) {
        if (!(otherName in this.relationships)) {
            this.relationships[otherName] = 0;
        }
        this.relationships[otherName] += amount;
    }
}

// ALL CONTESTANTS //
// - SEASON 1 - //
const joeygraceffa = new Contestant("Joey Graceffa", "JoeyGraceffa");
const evagutowski = new Contestant("Eva Gutowski", "EvaGutowski");
const oliwhite = new Contestant("Oli White", "OliWhite");
const lelepons = new Contestant("Lele Pons", "LelePons");
const timothydelaghetto = new Contestant("Timothy DeLaGhetto", "TimothyDeLaGhetto");
const matthaag = new Contestant("Matt Haag", "MattHaag");
const sierrafurtado = new Contestant("Sierra Furtado", "SierraFurtado");
const glozellgreen = new Contestant("GloZell Green", "GloZellGreen");
const justineezarik = new Contestant("Justine Ezarik", "JustineEzarik");
const andreabrooks = new Contestant("Andrea Brooks", "AndreaBrooks");
const shanedawson = new Contestant("Shane Dawson", "ShaneDawson");

const season1cast = [joeygraceffa, evagutowski, oliwhite, lelepons, timothydelaghetto, matthaag, sierrafurtado, glozellgreen, justineezarik, andreabrooks, shanedawson];

// - SEASON 2 - //
const andrearussett = new Contestant("Andrea Russett", "AndreaRussett");
const tyleroakley = new Contestant("Tyler Oakley", "TylerOakley");
const alexwassabi = new Contestant("Alex Wassabi", "AlexWassabi");
const gabbiehanna = new Contestant("Gabbie Hanna", "GabbieHanna");
const tanamongeau = new Contestant("Tana Mongeau", "TanaMongeau");
const lizakoshy = new Contestant("Liza Koshy", "LizaKoshy");
const destormpower = new Contestant("DeStorm Power", "DeStormPower");
const jessewellens = new Contestant("Jesse Wellens", "JesseWellens");
const laurenriihimaki = new Contestant("Lauren Riihimaki", "LaurenRiihimaki");

const season2cast = [joeygraceffa, andrearussett, tyleroakley, alexwassabi, gabbiehanna, tanamongeau, lizakoshy, destormpower, jessewellens, laurenriihimaki];

// - SEASON 3 - //
const matthewpatrick = new Contestant("Matthew Patrick", "MatthewPatrick");
const nikitadragun = new Contestant("Nikita Dragun", "NikitaDragun");
const mannymua = new Contestant("Manny MUA", "MannyMUA");
const rosannapansino = new Contestant("Rosanna Pansino", "RosannaPansino");
const safiyanygaard = new Contestant("Safiya Nygaard", "SafiyaNygaard");
const colleenballinger = new Contestant("Colleen Ballinger", "ColleenBallinger");
const tealadunn = new Contestant("Teala Dunn", "TealaDunn");
const guavajuice = new Contestant("Guava Juice", "GuavaJuice");
const jccaylen = new Contestant("JC Caylen", "JCCaylen");

const season3cast = [joeygraceffa, matthewpatrick, nikitadragun, mannymua, rosannapansino, safiyanygaard, colleenballinger, tealadunn, guavajuice, jccaylen];

// - SEASON 4 - //
const bretmanrock = new Contestant("Bretman Rock", "BretmanRock");

const season4cast = [joeygraceffa, colleenballinger, bretmanrock, rosannapansino, alexwassabi, gabbiehanna, tanamongeau, destormpower, timothydelaghetto, justineezarik];

// - THE MOVIE - //
const moviecast = [joeygraceffa, rosannapansino, tanamongeau, matthewpatrick, nikitadragun, bretmanrock, lelepons];

const allContestants = [joeygraceffa, evagutowski, oliwhite, lelepons, timothydelaghetto, matthaag, sierrafurtado, glozellgreen, justineezarik, andreabrooks, shanedawson, andrearussett, tyleroakley, alexwassabi, gabbiehanna, tanamongeau, lizakoshy, destormpower, jessewellens, laurenriihimaki, matthewpatrick, nikitadragun, mannymua, rosannapansino, safiyanygaard, colleenballinger, tealadunn, guavajuice, jccaylen, bretmanrock];
let currentcast = [];
let deadcast = [];
let entirecast = [];
let trappedguests = [];
let votingPool = [];
let votedguests = [];
let foundArtifacts = [];

let currentEnvironment = "";
let currentMonster = null;

let currentepisode = 0;
let remainingartifacts = 0;

let currentBetrayals = 0;
let maximumBetrayals = 1;
let currentPairChallenges = 0;
let maximumPairChallenges = 2;

let seasonover = false;
let forcenone = false;
let forcetrapped = false;
let forcepoisoned = false;
let resurrectedcontestant = false;

loadCustomContestants();

function loadCustomContestants() {
    const data = localStorage.getItem("customContestants");
    if (data) {
        const arr = JSON.parse(data);
        arr.forEach(obj => {
            if (!allContestants.some(c => c.name === obj.name)) {
                const c = new Contestant(obj.name, obj.image);
                c.isCustom = true;
                allContestants.push(c);
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("custom")) return;
    renderCustomList();

    const addBtn = document.getElementById("add-custom-btn");
    if (addBtn) {
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addCustomContestant();
        });
    }

    function saveCustomContestants() {
        const customContestants = currentcast.filter(c => c.isCustom);
        localStorage.setItem("customContestants", JSON.stringify(customContestants.map(c => ({
            name: c.name,
            image: c.image,
            isCustom: true
        }))));
    }

    function addCustomContestant() {
        const nameInput = document.getElementById("custom-name");
        const imageUrlInput = document.getElementById("custom-image-url");
        const name = nameInput.value.trim();
        const imageUrl = imageUrlInput ? imageUrlInput.value.trim() : "";

        if (!name) {
            alert("Please enter a name.");
            return;
        }

        const finalImageUrl = imageUrl || "image/SAE_Logo.webp";

        const newContestant = new Contestant(name, finalImageUrl);
        newContestant.isCustom = true;

        currentcast.push(newContestant);
        allContestants.push(newContestant);
        saveCustomContestants();
        renderCustomList();

        nameInput.value = "";
        if (imageUrlInput) imageUrlInput.value = "";
    }

    function deleteCustomContestant(contestant) {
        const idxCurrent = currentcast.findIndex(c => c.name === contestant.name);
        if (idxCurrent !== -1) currentcast.splice(idxCurrent, 1);

        const idxAll = allContestants.findIndex(c => c.name === contestant.name);
        if (idxAll !== -1) allContestants.splice(idxAll, 1);

        saveCustomContestants();
    }

    function renderCustomList() {
        const container = document.getElementById("custom-list");
        if (!container) return;
        container.innerHTML = "";

        allContestants.forEach(c => {
            if (c.isCustom) {
                const castItem = document.createElement("div");
                castItem.classList.add("cast-item", "custom-contestant");

                castItem.innerHTML = `
          <img loading="lazy" src="${c.image}" alt="${c.name}">
          <p>${c.name}</p>
          <button class="remove-btn" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        `;

                castItem.querySelector(".remove-btn").addEventListener("click", (e) => {
                    e.stopPropagation();

                    if (!confirm(`Delete contestant "${c.name}"?`)) return;

                    deleteCustomContestant(c);
                    renderCustomList();
                });

                container.appendChild(castItem);
            }
        });
    }
});

if (window.location.pathname.includes("index")) {
    window.addEventListener("DOMContentLoaded", () => {
        const button = document.getElementById("debug-button");
        const menu = document.getElementById("debug-menu");

        button.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    });

    const searchInput = document.getElementById("contestant-search");
    const dropdown = document.getElementById("search-dropdown");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
        }

        const matches = allContestants.filter(c => c.displayName.toLowerCase().includes(query));

        if (matches.length === 0) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
        }

        dropdown.innerHTML = matches.map(c => `<div data-name="${c.displayName}">${c.displayName}</div>`).join("");
        dropdown.style.display = "block";

        dropdown.querySelectorAll("div").forEach(item => {
            item.addEventListener("click", () => {
                const selectedName = item.getAttribute("data-name");
                searchInput.value = selectedName;

                const selectedContestant = allContestants.find(c => c.displayName === selectedName);
                if (selectedContestant && !currentcast.includes(selectedContestant)) {
                    currentcast.push(selectedContestant);
                    updateCastScreen();
                }
                dropdown.style.display = "none";
                dropdown.innerHTML = "";
            });
        });
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
        }
    });
}

class Artifacts {
    constructor() {
        this.monsters = [
            "vampire",
            "horde of zombies",
            "monster",
            "horde of clowns",
            "clown",
            "demon",
            "werewolf"
        ];

        this.artifacts = [
            "the cursed artifact",
            "the life stone",
            "the jack in the box",
            "the serpent's eyes",
            "the stature of era",
            "the demonic configuration",
            "the night killer doll",
            "the psychedelic swirl",
            "the wicker-man doll",
            "the collar of control",
            "the lazarus box",
            "the harp"
        ];

        this.steps = [
            "they take a short break.",
            "they split into two groups to find the artifact.",
            "they split into two groups to escape a monster.",
            "they split into two groups to find a key.",
            "they split into two groups to find a code.",
            "they use a map to get to the next clue.",
            "they look around for the artifact.",
            "they have to solve a slide puzzle.",
            "they escape from a slowly burning room.",
            "they escape from a room filling with water.",
            "they look around in the dark for a clue.",
            "they use their past knowledge to get past a puzzle.",
            "they run through a maze.",
            "they have to figure out which way to go.",
            "they have to find out which box to open.",
            "they have to find out which vial to drink.",
            "they have to get past a monster.",
            "they have to sneak past a monster.",
            "they have to find and kill a monster.",
            "they use clues to get a password.",
            "they have to decipher a code.",
            "they have to solve a color based puzzle.",
            "they have to find and open a safe.",
            "they have to find and open a box.",
            "they attempt to get out of a locked room.",
            "they have to create an antidote.",
            "they have to solve a puzzle.",
            "they have to dig up a box.",
            "they have to find a combination to a safe.",
            "they have to find the code to a safe.",
            "they have to figure out a password."
        ];
    }

    monster() {
        const index = Math.floor(Math.random() * this.monsters.length);
        return this.monsters[index];
    }

    artifact() {
        const index = Math.floor(Math.random() * this.artifacts.length);
        foundArtifacts.push(this.artifacts[index]);
        return this.artifacts[index];
    }

    generateNarrative(scene) {
        const numSteps = 3 + Math.floor(Math.random() * 3);
        const usedIndexes = new Set();
        const selectedSteps = [];

        while (selectedSteps.length < numSteps) {
            const index = Math.floor(Math.random() * this.steps.length);
            if (!usedIndexes.has(index)) {
                usedIndexes.add(index);
                selectedSteps.push(this.steps[index]);
            }
        }

        const intros = ["First,", "Then,"];
        for (let i = 0; i < selectedSteps.length; i++) {
            let prefix;
            if (i === 0) prefix = "First,";
            else if (i === selectedSteps.length - 1) prefix = "And finally,";
            else prefix = "Then,";
            scene.paragraph(`${prefix} ${selectedSteps[i]}`);
        }
    }
}

class Discussions {
    constructor(currentcast, trappedguests) {
        this.currentcast = currentcast;
        this.trappedguests = trappedguests;
        this.availableContestants = this.currentcast.filter(c => !trappedguests.includes(c));

        this.ensureRelationships();

        this.searchActions = [
            a => `${a.name} investigates alone.`,
            a => `${a.name} rests.`,
            a => `${a.name} tries looking for secrets.`,
            a => `${a.name} sulks.`,
            a => `${a.name} tries to solve clues.`,
        ];

        this.idleActions = [
            a => `${a.name} does absolutely nothing.`,
            a => `${a.name} falls asleep.`,
            a => `${a.name} hums to themselves.`,
            a => `${a.name} pretends to do something.`,
            a => `${a.name} paces, but never actually helps.`,
        ];

        this.dualActions = [
            {
                action: (a, b) => `${a.name} and ${b.name} get into a heated argument.`,
                effect: (a, b) => this.changeRelationship(a, b, -10),
                minRelation: -100,
                maxRelation: 20
            },
            {
                action: (a, b) => `${a.name} gets into an alliance with ${b.name}.`,
                effect: (a, b) => this.changeRelationship(a, b, +20),
                minRelation: -10,
                maxRelation: 100
            },
            {
                action: (a, b) => `${a.name} and ${b.name} hang out.`,
                effect: (a, b) => this.changeRelationship(a, b, +10),
                minRelation: -20,
                maxRelation: 100
            },
            {
                action: (a, b) => `${a.name} pushes ${b.name} into a wall during an argument.`,
                effect: (a, b) => this.changeRelationship(a, b, -20),
                minRelation: -100,
                maxRelation: -25
            },
            {
                action: (a, b) => `${a.name} screams at ${b.name}.`,
                effect: (a, b) => this.changeRelationship(a, b, -10),
                minRelation: -100,
                maxRelation: 5
            }
        ];
    }

    ensureRelationships() {
        this.currentcast.forEach(c => {
            if (!c.relationships) {
                c.relationships = {};
            }
            this.currentcast.forEach(other => {
                if (other !== c && !(other.name in c.relationships)) {
                    c.relationships[other.name] = 0;
                }
            });
        });
    }

    changeRelationship(a, b, amount) {
        if (!a.relationships || !b.relationships) return;

        if (!(b.name in a.relationships)) a.relationships[b.name] = 0;
        if (!(a.name in b.relationships)) b.relationships[a.name] = 0;

        a.relationships[b.name] += amount;
        b.relationships[a.name] += amount;
    }

    runSoloInteraction(scene) {
        if (this.availableContestants.length < 1) return;
        const a = this.pickOne(this.availableContestants);

        const actionText = this.pickOne(this.searchActions)(a);

        for (const otherName in a.relationships) {
            a.relationships[otherName] += 1;
        }

        let main = document.getElementById("main-content");
        let div = document.createElement("div");
        main.append(div);
        div.id = "grid";

        let img = document.createElement("img");
        img.src = a.image;
        img.loading = "lazy";
        div.appendChild(img);

        scene.paragraph(actionText);
    }

    runDualInteraction(scene) {
        if (this.availableContestants.length < 2) return;

        const a = this.pickOne(this.availableContestants);
        const b = this.pickOne(this.availableContestants.filter(x => x !== a));

        const rel = a.relationships?.[b.name] ?? 0;

        let validActions = this.dualActions.filter(action =>
            rel >= action.minRelation && rel <= action.maxRelation
        );

        if (validActions.length === 0) {
            validActions = this.dualActions;
        }

        const chosen = this.pickOne(validActions);

        let main = document.getElementById("main-content");
        let div = document.createElement("div");
        main.append(div);
        div.id = "grid";

        let img1 = document.createElement("img");
        let img2 = document.createElement("img");
        img1.src = a.image;
        img2.src = b.image;
        img1.loading = "lazy";
        img2.loading = "lazy";
        div.appendChild(img1);
        div.appendChild(img2);

        scene.paragraph(chosen.action(a, b));
        chosen.effect(a, b);
    }

    pickOne(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

class VotingCeremony {
    constructor() {
        this.currentcast = currentcast;

        this.votingreasons = [
            "for not pulling their weight.",
            "because they don't really like them.",
            "after a minor disagreement.",
            "after a major disagreement.",
            "because they are too weak.",
            "because they chose randomly.",
            "because someone else told them to.",
            "because they had a grudge against them.",
            "because they are too hostile.",
            "because they argued with their friend."
        ];
    }

    reason() {
        const index = Math.floor(Math.random() * this.votingreasons.length);
        return this.votingreasons[index];
    }

    voting() {
        const scene = new Scene();
        scene.title("The guests vote...");

        this.currentcast.forEach(c => {
            const possibleVotes = this.currentcast.filter(member => member !== c);

            let votedmember;
            const randomFactor = 0.1;

            if (Math.random() < randomFactor) {
                votedmember = possibleVotes[Math.floor(Math.random() * possibleVotes.length)];
            } else {
                const weighted = [];
                possibleVotes.forEach(target => {
                    const rel = c.relationships?.[target.name] ?? 0;
                    const hostility = Math.max(1, 100 - (rel + 50));
                    for (let i = 0; i < hostility; i++) {
                        weighted.push(target);
                    }
                });
                votedmember = weighted[Math.floor(Math.random() * weighted.length)];
            }

            c.choice = votedmember;

            // Visuals
            const main = scene._main;
            const div = document.createElement("div");
            div.id = "grid";
            main.appendChild(div);

            const img1 = document.createElement("img");
            img1.src = c.image;
            img1.loading = "lazy";
            div.appendChild(img1);

            const img2 = document.createElement("img");
            img2.src = votedmember.image;
            img2.loading = "lazy";
            div.appendChild(img2);

            scene.paragraph(`${c.name} voted for ${votedmember.name} ${this.reason()}`);
        });
    }
}

class Challenge {
    constructor() {
        this.winnerText = [
            "easily wins the challenge",
            "barely wins the challenge"
        ];
        this.deathText = [
            "bludgeons",
            "mauls",
            "slashes",
            "strangles",
            "beats",
            "hangs",
            "stabs"
        ];
    }
}

class Scene {
    constructor(_main) {
        this._main = document.getElementById("main-content");
        this._advanceCode = null;
    }

    rightClick() {
        if (!document.getElementById("inputRightKey")) {
            let text = document.createElement("input");
            text.setAttribute("class", "textRightClick");
            text.setAttribute("id", "inputRightKey");
            text.setAttribute("type", "text");
            text.setAttribute("readonly", "readonly");
            this._main.parentElement.appendChild(text);
        }
    }

    clean() {
        this._main.innerHTML = "";
        this.rightClick();
    }

    title(text) {
        let title = document.getElementById("title-text");
        title.innerHTML = text;
    }

    paragraph(text) {
        let paragraph = document.createElement("p");
        paragraph.innerHTML = text;
        this._main.appendChild(paragraph);
    }

    image(source) {
        let image = document.createElement("img");
        image.src = source;
        image.setAttribute("loading", "lazy");
        this._main.appendChild(image);
    }

    button(text, eventCode) {
        let button = document.createElement("button");
        button.innerHTML = text;
        button.setAttribute("onclick", eventCode);
        this._main.appendChild(button);

        let textField = document.getElementById("inputRightKey");
        if (!textField) return;

        textField.focus();

        const handleKey = (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                textField.remove();
                button.click();
            }
        };

        textField.addEventListener("keydown", handleKey, { once: true });

        document.addEventListener("click", (e) => {
            if (
                e.target.id !== "inputRightKey" &&
                e.target.tagName !== "SELECT"
            ) {
                textField.focus();
            }
        });
    }
}

// ALL FUNCTIONS //
function randomContestant() {
    const eligible = allContestants.filter(c =>
        !currentcast.includes(c)
    );

    if (eligible.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * eligible.length);
    const chosen = eligible[randomIndex];

    currentcast.push(chosen);
    updateCastScreen();
    return chosen;
}

function predefinedCast(cast) {
    cast.forEach(c => {
        currentcast.push(c);
    })

    if (cast === season1cast) {
        forcepoisoned = true;
        forcetrapped = false;

        currentEnvironment = "mansion";
    }
    else if (cast === season2cast) {
        forcepoisoned = false;
        forcetrapped = true;

        currentEnvironment = "palace";
    }
    else if (cast === season3cast) {
        forcenone = true;
        forcepoisoned = false;
        forcetrapped = false;

        currentEnvironment = "carnival";
    }
    else if (cast === season4cast) {
        forcepoisoned = false;
        forcetrapped = true;

        currentEnvironment = "tomb";
    } else {
        const enviorments = ["mansion", "palace", "carnival", "tomb"];
        currentEnvironment = enviorments[Math.floor(Math.random() * enviorments.length)];
    }
}

function updateCastScreen() {
    const castContainer = document.getElementById("current-cast");

    castContainer.innerHTML = "";
    if (currentcast.length === 0) {
        castContainer.innerHTML = `<p>No contestants have been added...</p>`;
        return;
    }
    currentcast.forEach(c => {
        createCard(c)
    });
}
function createCard(c) {
    const castContainer = document.getElementById("current-cast");
    const castItem = document.createElement("div");

    castItem.classList.add("cast-item");
    castItem.innerHTML = `
            <img loading="lazy" src="${c.image}" alt="${c.displayName}">
            <p>${c.displayName}</p>
            <button class="remove-btn"><i class="fas fa-times"></i></button>
        `;
    const removeButton = castItem.querySelector(".remove-btn");
    removeButton.addEventListener("click", () => {
        removeContestant(c);
    });

    castContainer.appendChild(castItem);
}

function removeContestant(contestant) {
    currentcast = currentcast.filter(c => c !== contestant);
    updateCastScreen();
}

function startSimulation(predefinedcast = null) {
    currentcast = [];
    deadcast = [];
    trappedguests = [];
    currentepisode = 0;
    foundArtifacts = [];
    remainingartifacts = 0;
    seasonover = false;

    if (document.location.pathname.includes("index")) {
        let environment = document.getElementById("environment");
        if (environment.value === "random") {
            const validOptions = Array.from(environment.options)
                .filter(opt => opt.value !== "random");

            const randomIndex = Math.floor(Math.random() * validOptions.length);
            currentEnvironment = validOptions[randomIndex].value;
        } else {
            currentEnvironment = environment.value;
        }

        const betrayInput = document.getElementById("betray-limit");
        const pairsInput = document.getElementById("pairs-limit");

        if (betrayInput && betrayInput.value.trim() !== "")
            maximumBetrayals = parseInt(betrayInput.value);

        if (pairsInput && pairsInput.value.trim() !== "")
            maximumPairChallenges = parseInt(pairsInput.value);
    } else {
        maximumBetrayals = 1;
        maximumPairChallenges = 2;
    }

    if (predefinedcast !== null) {
        predefinedCast(predefinedcast);
    }

    currentcast.forEach(c => {
        entirecast.push(c);
    })

    if (currentcast.length <= 3) {
        alert("You need at least 4 contestants to start the simulation!");
    } else {
        currentcast.forEach(c => {
            c.relationships = {};
            currentcast.forEach(other => {
                if (other !== c) {
                    c.relationships[other.name] = 0;
                }
            });
        });

        remainingartifacts = currentcast.length - 2;
        const scene = new Scene();
        scene.title(`The guests arrive at the ${currentEnvironment}`);
        scene.clean();
        currentcast.forEach(c => {
            scene.image(c.image);
            scene.paragraph(c.name + ` arrives at the ${currentEnvironment}.`);
        });
        currentepisode++;
        if (currentepisode === 1) {
            if (forcenone === false) {
                if (forcetrapped) {
                    scene.button("Proceed", "determineTrapped()");
                } else if (forcepoisoned) {
                    scene.button("Proceed", "determinePoisoned()");
                } else {
                    let eventType = Math.floor(Math.random() * 3);
                    if (eventType === 0) {
                        scene.button("Proceed", "determineTrapped()");
                    } else if (eventType === 1) {
                        scene.button("Proceed", "determinePoisoned()");
                    } else {
                        scene.button("Proceed", "newEpisode(false)");
                    }
                }
            }
            else
            {
                scene.button("Proceed", "newEpisode(false)");
            }
        }
        else {
            scene.button("Proceed", "newEpisode()");
        }
    }
}

function determineTrapped() {
    let amountTrapped;
    if (currentcast.length >= 8) {
        amountTrapped = Math.floor(Math.random() * 4) + 1;
    } else {
        amountTrapped = Math.floor(Math.random() * 2) + 1;
    }

    const trapped = [];
    const shuffled = [...currentcast].sort(() => 0.5 - Math.random());

    for (let i = 0; i < amountTrapped; i++) {
        trapped.push(shuffled[i]);
    }
    const scene = new Scene();
    scene.clean();
    trapped.forEach(c => {
        trappedguests.push(c);
        c.trapped = true;
        scene.image(c.image);
        scene.paragraph(c.name + `has been kidnapped and trapped in the ${currentEnvironment}.`);
    })
    scene.button("Proceed", "newEpisode(true)");
}

function determinePoisoned() {
    const scene = new Scene();
    scene.clean();

    let poisoned = currentcast[Math.floor(Math.random() * currentcast.length)];
    scene.image(poisoned.image);
    scene.paragraph(poisoned.name + ` starts spitting out blood, they have been poisoned by the ${currentEnvironment}.`);
    let successRate = Math.floor(Math.random() * 100);
    if (successRate < 50) {
        currentcast = currentcast.filter(c => c !== poisoned);
        deadcast.push(poisoned);
        poisoned.deathepisode = currentepisode;
        scene.paragraph(`The guests fail to get the cure in time, and ${poisoned.name} dies....`);
    } else {
        scene.paragraph(`The guests succeed to get the cure in time, and ${poisoned.name} is cured!`);
    }
    scene.button("Proceed", "newEpisode(true)");
}

function newEpisode(eventOngoing) {
    if (eventOngoing === false) {
        currentepisode++;
    }

    const scene = new Scene();
    scene.clean();

    if (currentcast.length <= 3) {
        startFinale();
        return;
    }

    if (currentepisode === 1) {
        scene.paragraph(`The guests discover that they have to find ${remainingartifacts} artifacts.`);
        scene.paragraph(`For each artifact to be cleansed, at least one person must die.`)
    } else {
        votedguests = [];
        votingPool = [];
        trappedguests = [];
    }

    const generator = new Discussions(currentcast, trappedguests);
    if (currentcast.length > 8) {
        for (let i = 0; i < 6; i++) {
            generator.runDualInteraction(scene);
            generator.runSoloInteraction(scene);
        }
    } else if (currentcast.length > 4) {
        for (let i = 0; i < 4; i++) {
            generator.runDualInteraction(scene);
            generator.runSoloInteraction(scene);
        }
    }
    else {
        for (let i = 0; i < 2; i++) {
            generator.runDualInteraction(scene);
            generator.runSoloInteraction(scene);
        }
    }
    if (trappedguests.length > 0) {
        scene.button("Proceed", "findOthers()");
    } else {
        scene.button("Proceed", "findArtifact()");
    }
}

function findOthers() {
    const scene = new Scene();
    scene.clean();
    scene.title("The guests find the others...");
    let number = currentcast.length - trappedguests.length;
    scene.paragraph(`The ${number} come across the trapped guests.`);
    if (trappedguests.length > 0) {
        let main = document.getElementById("main-content");
        let div = document.createElement("div");
        main.append(div);
        div.setAttribute("id", "grid");
        trappedguests.forEach(c => {
            let image = document.createElement("img");
            image.src = c.image;
            image.setAttribute("loading", "lazy");
            div.append(image);
        })
        let trappedNames = trappedguests.map(c => c.name).join(", ");
        scene.paragraph(`${trappedNames} ${trappedguests.length > 1 ? "have" : "has"} have been found and freed.`);
    }

    scene.button("Proceed", "findArtifact()");
}

function findArtifact() {
    const scene = new Scene();
    const artifacts = new Artifacts();

    scene.clean();
    scene.title("The guests find the artifact...");
    currentMonster = artifacts.monster();
    let main = document.getElementById("main-content");
    let div = document.createElement("div");
    div.setAttribute("id", "grid");
    main.append(div);
    currentcast.forEach(c => {
        let img = document.createElement("img");
        img.src = c.image;
        img.setAttribute("loading", "lazy");
        div.append(img);
    })
    scene.paragraph(`A ${currentMonster} suddenly chases the guests!`);
    let hr1 = document.createElement("hr");
    main.append(hr1);
    artifacts.generateNarrative(scene);
    let hr2  = document.createElement("hr");
    main.append(hr2);
    scene.paragraph(`They find ${artifacts.artifact()}!`);
    if (
        (foundArtifacts.includes("the lazarus box") || foundArtifacts.includes("the harp")) &&
        resurrectedcontestant === false &&
        deadcast.length > 0
    ) {
        scene.paragraph("The artifact has a note, the guests find out they can resurrect a dead houseguest.");

        const resurrected = deadcast[Math.floor(Math.random() * deadcast.length)];
        resurrectedcontestant = true;
        currentcast.push(resurrected);
        deadcast = deadcast.filter(c => c !== resurrected);

        scene.image(resurrected.image);
        scene.paragraph(`${resurrected.name} has been resurrected, they are back in the game!`);
    }
    let hardworker = Math.floor(Math.random() * currentcast.length);
    scene.image(currentcast[hardworker].image);
    scene.paragraph(`However ${currentcast[hardworker].name} did the most work!`);
    scene.button("Proceed", "votingCeremony()");
}

function votingCeremony() {
    const scene = new Scene();
    scene.clean();
    scene.title("The voting ceremony begins...");
    let main = document.getElementById("main-content");
    let div = document.createElement("div");
    div.setAttribute("id", "grid");
    main.append(div);
    currentcast.forEach(c => {
        let img = document.createElement("img");
        img.src = c.image;
        img.setAttribute("loading", "lazy");
        div.append(img);
    })
    scene.paragraph(`To cleanse the artifact, the ${currentcast.length} remaining have to vote 2 people.`)
    scene.paragraph(`One or both of them will die.`);
    let hr = document.createElement("hr");
    main.append(hr);
    let voting = new VotingCeremony();
    voting.voting();
    let hr2 = document.createElement("hr");
    main.append(hr2);
    scene.button("Proceed", "shuffleVotes()");
}

function shuffleVotes() {
    currentcast.forEach(c => {
        votingPool.push(c.choice);
    })

    const scene = new Scene();
    scene.clean();
    scene.title("The votes are in...");

    scene.paragraph("The first person going into the challenge is...");
    let person1 = votingPool[Math.floor(Math.random() * votingPool.length)];
    let remainingPool = votingPool.filter(p => p !== person1);
    scene.image(person1.image);
    scene.paragraph(`${person1.name}...`);

    scene.paragraph("The second person going into the challenge is...");
    let person2 = remainingPool[Math.floor(Math.random() * remainingPool.length)];
    scene.image(person2.image);
    scene.paragraph(`${person2.name}...`);

    votedguests.push(person1);
    votedguests.push(person2);

    scene.button("Proceed", "startChallenge()");
}

function startChallenge() {
    const scene = new Scene();
    const challenge = new Challenge();
    const artifacts = new Artifacts();

    scene.clean();
    scene.title("The challenge begins...");

    function createGrid() {
        const grid = document.createElement("div");
        grid.id = "grid";
        scene._main.appendChild(grid);
        return grid;
    }

    let votedGuestsGrid = createGrid();
    const fragment = document.createDocumentFragment();
    votedguests.forEach(c => {
        const img = document.createElement("img");
        img.src = c.image;
        img.loading = "lazy";
        fragment.appendChild(img);
    });
    votedGuestsGrid.appendChild(fragment);

    scene.paragraph("The two are led to an area.");

    let randomizer = Math.floor(Math.random() * 3);
    if (currentcast.length < 4 && randomizer === 2) {
        randomizer = 0;
    }

    if (currentPairChallenges === maximumPairChallenges && randomizer === 2) {
        randomizer = 0;
    }
    if (currentBetrayals === maximumBetrayals && randomizer === 1) {
        randomizer = 0;
    }

    remainingartifacts--;
    const randomDeathText = challenge.deathText[Math.floor(Math.random() * challenge.deathText.length)];

    if (randomizer === 0) {
        const randomArtifactStep = artifacts.steps[Math.floor(Math.random() * artifacts.steps.length)];
        scene.paragraph(`For the challenge, ${randomArtifactStep}`);

        let doublekill = Math.floor(Math.random() * 100);
        if (doublekill > 10  || currentcast.length <= 4) {
            const winner = votedguests[Math.floor(Math.random() * votedguests.length)];
            const potentialLosers = votedguests.filter(p => p !== winner);
            const loser = potentialLosers[Math.floor(Math.random() * potentialLosers.length)];

            scene.image(winner.image);
            scene.paragraph(`${winner.name} wins the challenge.`);
            scene.image(loser.image);
            scene.paragraph(`The ${currentMonster} then ${randomDeathText} ${loser.name} to death...`);

            loser.deathepisode = currentepisode;
            deadcast.push(loser);
            currentcast = currentcast.filter(c => c !== loser);
        } else if (doublekill < 10 && currentcast.length > 4) {
            let main = document.getElementById("main-content");
            let div = document.createElement("div");
            div.setAttribute("id", "grid");
            main.append(div);

            votedguests.forEach(c => {
                let img = document.createElement("img");
                img.src = c.image;
                img.setAttribute("loading", "lazy");
                div.append(img);

                c.deathepisode = currentepisode;
                deadcast.push(c);
                currentcast = currentcast.filter(castMember => castMember !== c);
            });

            let names = votedguests.map(c => c.name).join(" and ");
            scene.paragraph(`The ${currentMonster} ${randomDeathText} ${names} to death...`);
        }

        scene.button("Proceed", "contestantStandings()");
    } else if (randomizer === 1) {
        scene.paragraph("In a twist, they get to betray one of their fellow houseguests.");

        let betrayedPerson;
        let betrayalGrid = createGrid();
        currentBetrayals++;
        function weightedChoiceBasedOnRelations(betrayer, candidates) {
            const weighted = [];
            candidates.forEach(target => {
                const rel = betrayer.relationships?.[target.name] ?? 0;
                const hostility = Math.max(1, 100 - (rel + 50));
                for (let i = 0; i < hostility; i++) {
                    weighted.push(target);
                }
            });
            return weighted[Math.floor(Math.random() * weighted.length)];
        }

        while (true) {
            if (votedguests[0].choice === votedguests[1].choice) {
                betrayedPerson = votedguests[0].choice;

                if (votedguests.includes(betrayedPerson)) {
                    votedguests.forEach(c => {
                        const others = currentcast.filter(x => x !== c);
                        c.choice = weightedChoiceBasedOnRelations(c, others);
                    });
                    continue;
                }

                const img2 = document.createElement("img");
                img2.src = votedguests[0].image;
                img2.loading = "lazy";

                const img3 = document.createElement("img");
                img3.src = votedguests[1].image;
                img3.loading = "lazy";

                const img = document.createElement("img");
                img.src = betrayedPerson.image;
                img.loading = "lazy";

                betrayalGrid.appendChild(img2);
                betrayalGrid.appendChild(img3);
                betrayalGrid.appendChild(img);

                scene.paragraph(`They agree on betraying ${betrayedPerson.name}...`);
                break;

            } else {
                const betrayer = votedguests[0];
                let others = currentcast.filter(c => c !== betrayer);

                betrayer.choice = weightedChoiceBasedOnRelations(betrayer, others);
                betrayedPerson = betrayer.choice;

                if (votedguests.includes(betrayedPerson)) {
                    others = currentcast.filter(c => c !== betrayer);
                    betrayer.choice = weightedChoiceBasedOnRelations(betrayer, others);
                    continue;
                }

                const imgBetrayer = document.createElement("img");
                imgBetrayer.src = betrayer.image;
                imgBetrayer.loading = "lazy";

                const imgBetrayed = document.createElement("img");
                imgBetrayed.src = betrayedPerson.image;
                imgBetrayed.loading = "lazy";

                betrayalGrid.appendChild(imgBetrayer);
                betrayalGrid.appendChild(imgBetrayed);

                scene.paragraph(`${betrayer.name} chooses to betray ${betrayedPerson.name}`);
                break;
            }
        }

        scene.image(betrayedPerson.image);
        scene.paragraph(`The ${currentMonster} then ${randomDeathText} ${betrayedPerson.name} to death...`);

        betrayedPerson.deathepisode = currentepisode;
        deadcast.push(betrayedPerson);
        currentcast = currentcast.filter(c => c !== betrayedPerson);

        scene.button("Proceed", "contestantStandings()");
    } else {
        scene.paragraph("In a twist, they get to pick a partner to compete for them.");

        let grid = createGrid();
        let discussions = new Discussions(currentcast, trappedguests);

        currentPairChallenges++;
        const chosenPartners = [];

        votedguests.forEach(guest => {
            const eligiblePartners = currentcast.filter(c =>
                !votedguests.includes(c) && !chosenPartners.includes(c)
            );

            if (eligiblePartners.length === 0) {
                console.warn(`No eligible partners left for ${guest.name}`);
                guest.partner = null;
            } else {
                guest.partner = eligiblePartners[Math.floor(Math.random() * eligiblePartners.length)];
                chosenPartners.push(guest.partner);
            }
        });

        votedguests.forEach(guest => {
            const imgVoter = document.createElement("img");
            imgVoter.src = guest.image;
            imgVoter.loading = "lazy";

            const imgPartner = document.createElement("img");
            imgPartner.src = guest.partner?.image || "default.png";
            imgPartner.loading = "lazy";

            grid.appendChild(imgVoter);
            grid.appendChild(imgPartner);

            scene.paragraph(`${guest.name} chooses ${guest.partner?.name || "no one"} to compete for them.`);
        });

        const winningIndex = Math.floor(Math.random() * 2);
        const winningGuest = votedguests[winningIndex];
        const losingGuest = votedguests[1 - winningIndex];
        const loser = losingGuest;

        scene.image(winningGuest.partner.image);
        discussions.changeRelationship(winningGuest, winningGuest.partner, 50);
        scene.paragraph(`${winningGuest.partner.name} wins the challenge for ${winningGuest.name}!`);

        scene.image(losingGuest.partner.image);
        discussions.changeRelationship(losingGuest, losingGuest.partner, -100);
        scene.paragraph(`But ${losingGuest.partner.name} failed to protect ${loser.name}...`);
        scene.paragraph(`The ${currentMonster} then ${randomDeathText} ${loser.name} to death...`);

        loser.deathepisode = currentepisode;
        deadcast.push(loser);
        currentcast = currentcast.filter(c => c !== loser);

        scene.button("Proceed", "contestantStandings()");
    }
}

function contestantStandings() {
    const scene = new Scene();
    scene.clean();
    scene.title("The contestants standings...");

    const main = document.getElementById("main-content");

    const aliveSection = document.createElement("section");
    aliveSection.classList.add("contestant-section");

    const aliveTitle = document.createElement("h2");
    aliveTitle.innerText = "Alive";
    aliveSection.append(aliveTitle);

    const aliveGrid = document.createElement("div");
    aliveGrid.id = "current-cast";
    aliveSection.append(aliveGrid);

    currentcast.forEach(c => {
        const card = document.createElement("div");
        card.classList.add("cast-item");

        const img = document.createElement("img");
        img.src = c.image;
        img.setAttribute("loading", "lazy");
        card.append(img);

        if (seasonover === false) {
            const p = document.createElement("p");
            p.innerText = `${c.name}`;
            card.append(p);
        } else {
            const p = document.createElement("p");
            p.innerHTML = `${c.name}<br>Winner(s)`;
            card.append(p);
        }


        aliveGrid.append(card);
    });

    main.append(aliveSection);

    const deadSection = document.createElement("section");
    deadSection.classList.add("contestant-section");

    const deadTitle = document.createElement("h2");
    deadTitle.innerText = "Dead";
    deadSection.append(deadTitle);

    const deadGrid = document.createElement("div");
    deadGrid.id = "current-cast";
    deadSection.append(deadGrid);

    deadcast.forEach(c => {
        const card = document.createElement("div");
        card.classList.add("cast-item");
        card.style.filter = "grayscale(100%)";
        card.style.opacity = "0.6";

        const img = document.createElement("img");
        img.src = c.image;
        img.setAttribute("loading", "lazy");
        card.append(img);

        const p = document.createElement("p");
        p.innerHTML = `${c.name}<br><small>(Died Ep. ${c.deathepisode})</small>`;
        card.append(p);

        deadGrid.append(card);
    });

    main.append(deadSection);

    if (seasonover === false)
    {
        scene.button("Proceed", "newEpisode(false)");
    } else {
        scene.button("Resimulate", "startSimulation(entirecast)");
    }
}

function startFinale() {
    const scene = new Scene();
    scene.clean();
    scene.title("The final mile...");
    const div = document.createElement("div");
    div.setAttribute("id", "grid");
    scene._main.appendChild(div);
    currentcast.forEach(c => {
        const img = document.createElement("img");
        img.src = c.image;
        img.loading = "lazy";
        div.appendChild(img);
    })
    scene.paragraph(`The remaining guests now dash to find the last artifact.`);
    scene.paragraph(`A ${currentMonster} tries to stop them!`);
    let badEnding = Math.floor(Math.random() * 100);
    if (badEnding < 5) {
        const div = document.createElement("div");
        div.setAttribute("id", "grid");
        scene._main.appendChild(div);
        currentcast.forEach(c => {
            const img = document.createElement("img");
            img.src = c.image;
            img.loading = "lazy";
            div.appendChild(img);
            c.deathepisode = currentepisode;
            deadcast.push(c);
        })
        let deadNames = currentcast.map(c => c.name).join(", ");
        currentcast = currentcast.filter(c => c !== c);
        scene.paragraph(`${deadNames}, have been been caught by ${currentMonster}!`);
        scene.paragraph(`The guests failed to escape the night...`);
    } else if (badEnding < 10 && badEnding > 5) {
        const div = document.createElement("div");
        div.setAttribute("id", "grid");
        scene._main.appendChild(div);
        currentcast.forEach(c => {
            const img = document.createElement("img");
            img.src = c.image;
            img.loading = "lazy";
            div.appendChild(img);
        })
        scene.paragraph(`The guests have found the ${artifact.artifact()}!`);

        let thirdplace = currentcast[Math.floor(Math.random() * currentcast.length)];
        scene.image(thirdplace.image);
        scene.paragraph(`However ${thirdplace.name} has been caught and killed by ${currentMonster}!`);
        deadcast.push(thirdplace);
        currentcast = currentcast.filter(c => c !== thirdplace);

        currentcast.forEach(c => {
            const img = document.createElement("img");
            img.src = c.image;
            img.loading = "lazy";
            div.appendChild(img);
        })
        scene.paragraph("They have escaped the night...")
    } else {
        let artifact = new Artifacts();
        const div = document.createElement("div");
        div.setAttribute("id", "grid");
        scene._main.appendChild(div);
        currentcast.forEach(c => {
            const img = document.createElement("img");
            img.src = c.image;
            img.loading = "lazy";
            div.appendChild(img);
        })
        scene.paragraph(`The guests have found the ${artifact.artifact()}!`);
        scene.paragraph("They have escaped the night...")
    }
    seasonover = true;

    scene.button("Proceed", "contestantStandings()");
}