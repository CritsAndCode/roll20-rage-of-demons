on("chat:message", function(msg) {
    var foragingDC = 15 + randomInteger(5);

    if (msg.content === '!newDay') {
        sendChat(msg.who, '/w gm &{template:default} {{name=Setting Out}} ' +
            '{{Travel Speed=Ask players for their travel speed.\n\n' +
                'Fast: 8 miles/day. Pursuit decreases by 1. -5 to passive Wisdom (Perception) scores; no foraging.\n\n' +
                'Normal: 6 miles/day.\n\n' +
                'Slow: 4 miles/day. Pursuit increases. Advantage for foraging. Can use stealth.}}' +
            '{{Navigation=DC 10 Wisdom (Survival) check.\n ' +
                'Slow pace: +5 bonus.\n ' +
                'Fast pace: -5 penalty.\n' +
                'Failure: Characters are lost and wander for ' +
                randomInteger(6) + ' hours before the navigator can make a ' +
                'new check to find the right path.}}' +
            '{{Food & Water=Check food supplies. Each character requires 1 lb of food and 1 gal of water for each day. If a character does not eat for a number of days equal to their constitution modifier, they lose 1 constitution (and 1 for each subsequent day). If they do not drink for a day, they lose 1 constitution. Halving rations doubles this period, but the count does not reset until a full ration is eaten.}}' +
            '{{Foraging=DC ' + foragingDC + ' Wisdom (Survival) check.}}');
    }
    
    if (msg.content === '!travel') {
        sendChat(msg.who, rollForTravelEncounter());
    }
    
    if (msg.content === '!rest') {
        sendChat(msg.who, rollForRestEncounter());
    }
    
    if (msg.content === '!forage') {
        sendChat(msg.who, '/w gm &{template:default} {{name=ForageResult}}' + getForageResult());
    }
});

function streamsAvailable() {
    var roll = randomInteger(3);

    if (roll === 1) {
        return 'Streams can be found.';
    } else {
        return 'Streams are unavailable.';
    }
}

function getForageResult() {
    var roll = randomInteger(6);
    var waterRoll = randomInteger(9);
    var waterAvailability = '{{Water=No water is found.}}'
    var barrelstockFood = randomInteger(6) + 2;
    var barrelstockWater = randomInteger(4) + 2;
    var ripplebarkFood = randomInteger(4) + 4;
    var trillimacFood = randomInteger(6) + 2;
    var zurkhwoodFood = randomInteger(4) + 2;
    var grubsFood = randomInteger(6) + 2;
    var waterorbs = randomInteger(4);

    switch(waterRoll) {
        case 1:
            waterAvailability = '{{Water=A small stream is discovered.}}';
            break;
        case 2:
            waterAvailability = '{{Water=They find an underground lake--The water smells a bit like rotten eggs, but is drinkable.}}';
            break;
        case 3:
            waterAvailability = '{{Water=Water is bubbling up intermittently from a small hole in the ground.}}';
            break;
    }

    switch(roll) {
        case 1:
            return '{{Type=Barrelstalk}}' +
                '{{Food=' + barrelstockFood +
                ' + Wisdom (Survival) lbs of food.}}' +
                '{{Water=' + barrelstockWater +
                ' + Wisdom (Survival) gal of water}}' +
                '{{Description=Large, cask-shaped fungus that can be tapped and drained of the fresh water stored within it.}}';
            break;
        case 2:
            return '{{Type=Ripplebark}}' +
                '{{Food=' + ripplebarkFood +
                ' + Wisdom (Survival) lbs of food.}}' +
                waterAvailability +
                '{{Description=Shelf-like fungus that resembles a mass of rotting flesh. It is surprisingly edible. Though it can be eaten raw, it tastes better roasted.}}';
            break;
        case 3:
            return '{{Type=Trillimac}}' +
                '{{Food=' + trillimacFood +
                ' + Wisdom (Survival) lbs of food.}}' +
                waterAvailability +
                '{{Description=Mushroom that grows to a height of four to five feet, and has a broad gray-green cap and a light gray stalk. The cap’s leathery surface can be cut and cleaned for use in making maps, hats, and scrolls (its surface takes on dyes and inks well). The stalk can be cleaned, soaked in water for an hour, then dried to make a palatable food akin to bread.}}';
            break;
        case 4:
            return '{{Type=Waterorb}}' +
                '{{Count=' + waterorbs + ' + Wisdom (Survival) Waterorbs, each yielding 1 gal of water and 1 lb of food}}' +
                '{{Description=Bulbous fungus that grows in shallow water. A mature waterorb can be squeezed like a sponge, yielding a water and is edible (if chewy and somewhat tasteless).}}';

            break;
        case 5:
            return '{{Type=Zurkhwood}}' +
                '{{Food=' + zurkhwoodFood +
                ' + Wisdom (Survival) lbs of food}}' +
                waterAvailability +
                '{{Description=Massive mushroom that can reach a height of thirty to forty feet. Its large grain-like spores are edible, but zurkhwood is more important for its hard and woody stalks. Zurkhwood is one of the few sources of timber in the Underdark, used to make furniture, containers, bridges, and rafts, among other things. Skilled crafters can use stains, sanding, and polishing to bring out different patterns in zurkhwood.}}';
            break;
        case 6:
            return '{{Type=Giant Grubs}}' +
                '{{Food=' + grubsFood +
                ' + Wisdom (Survival) lbs of food}}' +
                waterAvailability +
                '{{Description=Large, white grubs that feed on decomposing creatures and fungus.}}';
            break;
    }

}

function rollForTravelEncounter() {
    var roll = randomInteger(20);
    var encounterMessage = '/w gm &{template:default} {{name=Travel Encounter}}';

    if (roll < 14) {
        encounterMessage += '{{Encounter= No encounters}}';
    } else if (roll >= 14 && roll < 16) {
        encounterMessage += '{{Encounter=' + rollTerrainEncounter() + '}}';
    } else if (roll >= 16 && roll < 18) {
        encounterMessage += '{{Encounter=' + rollCreatureEncounter() + '}}';
    } else {
        encounterMessage += '{{Terrain=' + rollTerrainEncounter() + '}}' + '{{Creature=' + rollCreatureEncounter() + '}}';
    }

    return encounterMessage;
}

function rollForRestEncounter() {
    var roll = randomInteger(20);
    var encounterMessage = '/w gm &{template:default} {{name=Rest Encounter}}';

    if (roll < 14) {
        encounterMessage += '{{Encounter=No encounter}}';
    } else {
        encounterMessage += '{{Encounter=' + rollCreatureEncounter() + '}}';
    }

    return encounterMessage;
}

function rollTerrainEncounter() {
    var roll = randomInteger(20);

    switch(roll) {
        case 1:
            return boneyard();
            break;
        case 2:
            return cliffAndLadder();
            break;
        case 3:
            return crystalClusters();
            break;
        case 4:
            return fungiCavern();
            break;
        case 5:
            return gasLeak();
            break;
        case 6:
            return gorge();
            break;
        case 7:
            return highLedge();
            break;
        case 8:
            return horridSounds();
            break;
        case 9:
            return lavaSwell();
            break;
        case 10:
            return muckPit();
            break;
        case 11:
            return rockFall();
            break;
        case 12:
            return ropeBridge();
            break;
        case 13:
            return ruins();
            break;
        case 14:
            return shelter();
            break;
        case 15:
            return sinkhole();
            break;
        case 16:
            return slimeMold();
            break;
        case 17:
            return steamVent();
            break;
        case 18:
            return undergroundStream();
            break;
        case 19:
            return warningSign();
            break;
        case 20:
            return webs();
            break;
    }
}

function rollCreatureEncounter() {
    var roll = randomInteger(20);

    switch(roll) {
        case 1:
            return ambushers();
            break;
        case 2:
            return ambushers();
            break;
        case 3:
            return carrionCrawler();
            break;
        case 4:
            return escapedSlaves();
            break;
        case 5:
            return escapedSlaves();
            break;
        case 6:
            return fungi();
            break;
        case 7:
            return fungi();
            break;
        case 8:
            return fireBeetles();
            break;
        case 9:
            return fireBeetles();
            break;
        case 10:
            return giantRocktopus();
            break;
        case 11:
            return giantRocktopus();
            break;
        case 12:
            return madCreature();
            break;
        case 13:
            return ochreJelly();
            break;
        case 14:
            return raiders();
            break;
        case 15:
            return raiders();
            break;
        case 16:
            return scouts();
            break;
        case 17:
            return societyOfBrilliance();
            break;
        case 18:
            return sporeServant();
            break;
        case 19:
            return traders();
            break;
        case 20:
            return traders();
            break;
    }
}

// =====================
// TERRAIN ENCOUNTERS
// =====================
function boneyard() {
    var roll = randomInteger(20);
    var encounterText = '';

    if (roll < 15) {
        encounterText = 'No encounter.'
    } else if (roll >=15 && roll < 18) {
        encounterText = randomInteger(4) + randomInteger(4) + randomInteger(4) + ' skeleton\n\n' +
            'The undead rise up out of the bones and attack when the first characters are halfway across the cavern';
    } else {
        encounterText = randomInteger(3) + ' minotaur skeletons\n\n' +
            'The undead rise up out of the bones and attack when the first characters are halfway across the cavern';
    }

    return 'The characters come upon an eerie cavern littered with countless bones of various creatures. Whether the site is a natural graveyard for some Underdark species or the former lair of a fearsome predator, the characters can potentially gather useful material for crafting among the bones.}}' +
        '{{Encounter = ' +
        encounterText;
}

function cliffAndLadder() {
    var cliffHeight = randomInteger(4) * 10;

    return 'A cliff ' + cliffHeight + ' feet high blocks the party’s passage, but a rolled-up rope ladder is visible at the top. If someone can climb the cliff—requiring a successful DC 15 Strength (Athletics) check—and toss down the ladder, the characters can proceed. Otherwise, they lose a day’s travel finding another route.\n\n' +
        'If the characters remove the ladder once they are at the top, they decrease the drow pursuit level by 1.'
}

function crystalClusters() {
    return 'The adventurers pass through a faerzress-suffused area containing fist-sized chunks of quartz that shed dim light in a 10-foot radius. A sharp blow to one of the crystals, including throwing it so it impacts a hard surface, causes it to burst in a 10-foot-radius flash of blinding light. Any creature within the radius must succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A creature blinded by this effect repeats the Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded.\n\n' +
        'The characters can harvest up to twelve of the crystals in total, but taking the time to do so increases the drow pursuit level by 1.\n\n' +
        'Spending eight or more hours in this area requires a DC 10 Wisdom save or gain a level of madness.'
}

function fungiCavern() {
    return 'The adventurers stumble upon a cavern filled with fungi and mushrooms of all sizes and types. Characters can harvest up to 20 lbs of food and 20 gal of water (provided they have the ability to carry it), but taking the time to do so increases the drow pursuit level by 1.'
}

function gasLeak() {
    return 'The adventurers come upon a cavern with a dangerous natural gas leak. Any member of the party with a passive Wisdom (Perception) score of 14 or higher detects signs of the gas. The characters’ travel pace for the day is slowed by half as they circumvent the area, increasing drow pursuit level by 1.\n\n' +
        'If the gas goes undetected, each character in the area must make a DC 12 Constitution saving throw, taking 5 (1d10) poison damage on a failed save, or half as much damage on a successful one.\n\n' +
        'Any open flames brought into the area cause the gas to explode. Each creature in the explosion must make a DC 15 Dexterity saving throw, taking 10 (3d6) fire damage on a failed save, or half as much damage on a successful one.'
}

function gorge() {
    var gorgeDepth = (randomInteger(4) + randomInteger(4)) * 100;

    return 'The characters must make a difficult climb down a gorge ' +
        gorgeDepth +
        ' feet deep and up the other side, or find a way around it.\n\n' +
        'Their travel pace for the day is slowed by half and drow pursuit level is increased by 1 unless they come up with a plan to cross the gorge quickly'
}

function highLedge() {
    var ravineDepth = (randomInteger(6) + randomInteger(6)) * 10;

    return 'The characters must walk along an 18-inch-wide ledge that skirts a ravine ' +
        ravineDepth +
        ' feet deep. The party’s travel pace for the day is slowed by half, and each character must succeed on a DC 10 Dexterity saving throw to avoid a fall. Precautions such as roping everyone together let each character make the save with advantage. Increase the pursuit level of the drow by 1.'
}

function horridSounds() {
    return 'For hours, the party’s travel is plagued by terrible shrieks, moans, and incoherent gibbering echoing through nearby passages, without any apparent origin.\n\n' +
        'Each character must make a successful DC 11 Wisdom saving throw. On a failed save, the character’s madness level increases by 1.'
}

function lavaSwell() {
    return 'As the party traverses a long and winding corridor, a tremor opens up a lava-filled fissure behind them. Each character must make a DC 10 Dexterity saving throw to avoid the lava swell, taking 21 (6d6) fire damage on a failed save. Decrease the drow pursuit level by 1.'
}

function muckPit() {
    return 'The adventurers must wade through a broad, 3-foot deep pit of slimy muck. The muck is difficult terrain and characters have disadvantage on Dexterity saving throws while within it, but their travel pace for the day is slowed by half if they go around it. Increase drow pursuit level by 1'
}

function rockFall() {
    return 'As the adventurers make their way through a long, twisting cavern, a tremor sets off a rockfall. Each party member must attempt three DC 12 Dexterity saving throws, taking 10 (3d6) bludgeoning damage on each failed save. Any incapacitated creature not moved out of the area is buried under rubble, taking an additional 1d6 bludgeoning damage at the end of each of its turns until the creature is dug out or dead.\n\n ' +
        'Decrease the drow pursuit level by 1.'
}

function ropeBridge() {
    var ravineWidth = (randomInteger(4) + randomInteger(4)) * 10;
    var ravineDepth = (randomInteger(4) + randomInteger(4)) * 10;

    return 'A ravine ' + ravineWidth + ' feet wide and ' + ravineDepth + ' feet deep cuts across the party’s path, spanned by an old rope bridge.\n\n' +
        'If the characters cut the bridge after they pass, the drow pursuit level decreases by 1.'
}

function ruins() {
    var roll = randomInteger(2);

    if (roll === 1) {
        return 'The adventurers come across a small ruin hidden in the Underdark. This might be the creation of a subterranean race or a surface ruin that collapsed and sank long ago. If the characters search the ruins, they find nothing.'
    } else {
        var trinketCount = randomInteger(4);

        return 'The adventurers come across a small ruin hidden in the Underdark. This might be the creation of a subterranean race or a surface ruin that collapsed and sank long ago. If the characters search the ruins, they find: ' + trinketCount + ' trinkets.\n' +
            '(Roll for trinket results on page 160 of Players Manual)';
    }
}

function shelter() {
    return 'The party stumbles upon a cave that is sheltered and easily defended. If the characters camp here, they can finish a long rest without any chance of an encounter while they are resting.'
}

function sinkhole() {
    return 'One random party member steps on and collapses a sinkhole, and must succeed on a DC 12 Dexterity saving throw to avoid falling into a 20-foot-deep pit and taking 7 (2d6) bludgeoning damage. Climbing out of the pit requires a successful DC 15 Strength (Athletics) check.'
}

function slimeMold() {
    var slimeType = '';
    var roll = randomInteger(6);

    if (roll < 4) {
        slimeType = 'Patch of green slime'
    } else if (roll < 6) {
        slimeType = 'Patch of yellow mold'
    } else {
        slimeType = 'Patch of brown mold'
    }

    return 'As the adventurers pass through a small cavern, they encounter a patch of slime or mold. Roll a d6 and consult the table to determine what type of slime or mold is present (see “Dungeon Hazards” in chapter 5 of the Dungeon Master’s Guide for details on these threats).\n\n' +
        'Slime type: ' + slimeType;
}

function steamVent() {
    return 'A hot steam vent erupts beneath a random party member, who must succeed on a DC 12 Dexterity saving throw or take 7 (2d6) fire damage.'
}

function undergroundStream() {
    var streamWidth = (randomInteger(4) + randomInteger(4)) * 5;

    return 'A waterway ' +
            streamWidth +
        ' feet wide cuts across the party’s path. The stream is shallow and easily crossed, and the characters can drink and refresh their water supplies.\n\n' +
        'Edible fish inhabit the stream, so that the DC of any foraging attempts for food in this area is reduced to 10. Crossing the stream reduces the drow pursuit level by 1.'
}

function warningSign() {
    var roll = randomInteger(20);
    var encounter = '';
    var encounterRoll;

    if (roll < 15) {
        encounter = 'nothing.'
    } else if (roll < 17) {
        encounter = 'an invisible barlgura.'
    } else if (roll < 19) {
        encounterRoll = randomInteger(4) + randomInteger(4) + randomInteger(4);
        encounter = encounterRoll + ' dretches.'
    } else {
        encounterRoll = randomInteger(2);
        encounter = encounterRoll + ' shadow demons.'
    }

    return 'The characters enter a cavern dotted with stalagmites and stalactites. Those with a passive Wisdom (Perception) score of 11 or higher spot a strange sigil carved into one of the stalagmites.\n\n' +
        'The sigil is a drow warning sign that means “Demons ahead!”\n\n' +
        'Any non-drow creature that touches the symbol must make a DC 10 Wisdom saving throw.\n' +
        'On a failed save, the creature’s madness level increases by 1.\n\n' +
        'If the characters take a long rest within one mile of the warning sign, they encounter ' +
            encounter;
}

function webs() {
    var roll = randomInteger(3);
    var encounter = '';
    var spiderCount = randomInteger(4);

    if (roll == 1) {
        encounter = '\n\nThe characters encounter ' + spiderCount + ' giant spiders.'
    }

    return 'Sticky webs fills a passage (see “Dungeon Hazards” in chapter 5 of the Dungeon Master’s Guide). The webs extend for hundreds of feet. Unless the characters come up with a plan for clearing the webs quickly, the party’s travel pace for the day is halved as the characters are forced to cut their way through or find an alternate route.' + encounter;
}

// =====================
// CREATURE ENCOUNTERS
// =====================
function ambushers() {
    var ambushers = 'Ambush!\n\n';

    ambushers += getAmbushers();

    if (isInLair()) {
        ambushers += '\n\nIn lair: ' + getLairDiscovery();
    }

    return ambushers;

    function getAmbushers() {
        var roll = randomInteger(20);

        if (roll < 3) {
            return '1 chool lurking in a pool of water'
        } else if (roll < 4) {
            return randomInteger(6) + ' giant spiders clinging to the walls or ceiling'
        } else if (roll < 6) {
            return '1 grell floating near the high ceiling'
        } else if (roll < 10) {
            return randomInteger(4) + ' gricks hiding in a crevice or fissure'
        } else if (roll < 16) {
            return randomInteger(4) + ' orogs perching on ledges'
        } else if (roll < 18) {
            return randomInteger(6) + ' pincers masquerading as stalactites'
        } else {
            return '1 umber hulk bursting out of a nearby wall'
        }
    }

    function isInLair() {
        return randomInteger(2) === 1;
    }

    function getLairDiscovery() {
        var roll = randomInteger(20);

        if (roll < 11) {
            return 'No discoveries.'
        } else if (roll < 13) {
            return 'A humanoid skeleton or corpse clutching a salvageable, nonmagical weapon (your choice)'
        } else if (roll < 15) {
            return 'A humanoid skeleton or corpse wearing a salvageable suit of nonmagical armor (your choice)'
        } else if (roll < 18) {
            return randomInteger(6) + ' gems woth 50gp'
        } else if (roll < 20) {
            return 'A humanoid skeleton or corpse carrying a random magic item (roll once on Magic Item Table B in chapter 7 of the Dungeon Master’s Guide)'
        } else {
            return 'A monster hoard containing ' + randomInteger(12) + ' gems worth 50gp and one or more random magic items (roll ' + randomInteger(4) + ' times on Magic Item Table C in chapter 7 of the Dungeon Master’s Guide)'
        }
    }
}

function carrionCrawler() {
    var roll = randomInteger(4);

    if (roll === 1) {
        return 'A domesticated carrion crawler scouring tunnels and caves for food.\n' +
            'The carrion crawler is outfitted with a leather saddle and harness, though there’s no sign of the rider. A character can approach and mount the carrion crawler without being attacked by succeeding on a DC 13 Wisdom (Animal Handling) check. While in the saddle and harness, a rider can remain mounted on the carrion crawler as it crawls across walls and ceilings.';
    } else {
        return 'A wild carrion crawler scouring tunnels and caves for food.';
    }
}

function escapedSlaves() {
    var roll = randomInteger(4);

    switch(roll) {
        case 1:
            return randomInteger(2) + ' moon elf commoners scouring for food and water.  If given food and water they’ll join the party.';
        case 2:
            return randomInteger(3) + ' shield dwarf commoners scouring for food and water.  If given food and water they’ll join the party.';
        case 3:
            return randomInteger(4) + ' human commoners scouring for food and water.  If given food and water they’ll join the party.';
        case 4:
            return randomInteger(6) + 'goblins scouring for food and water. They attack the players on sight.';
    }
}

function fungi() {
    var roll = randomInteger(3);

    switch(roll) {
        case 1:
            return gasSpores();
        case 2:
            return randomInteger(4) + ' shriekers.';
        case 3:
            return randomInteger(4) + ' violet fungi.';
    }


    function gasSpores() {
        var hasMemories = randomInteger(4);
        var gasSpores = randomInteger(4) + ' gas spores.';

        if (hasMemories === 1) {
            var memoryRoll = randomInteger(4);

            switch(memoryRoll) {
                case 1:
                    gasSpores += '\n\nMemories: A tense negotiation with drow, ending with the beholder agreeing to allow the drow safe passage through “the Vast Oblivium” in exchange for help ridding its lair of a deep gnome infestation.';
                    break;
                case 2:
                    gasSpores += '\n\nMemories: Chasing svirfneblin thieves through the tunnels of its domain to recover stolen gemstones.';
                    break;
                case 3:
                    gasSpores += '\n\nMemories: A fierce battle against a wizened drow archmage, ending with the beholder suffering a grievous injury.';
                    break;
                case 4:
                    gasSpores += '\n\nMemories:  Spying on a drow ranger with two gleaming scimitars and a black, quadrupedal animal companion.';
                    break;
            }
        }

        return gasSpores;
        }
}

function fireBeetles() {
    var roll = randomInteger(6) + randomInteger(6) + randomInteger(6);

    return 'A glow can be seen around a corner coming towards the caracters. ' + roll + ' giant fire beetles scouring the caves and tunnels looking for food. The characters look tasty. The beetles glowing glands can be harvested from the beetles.'
}

function giantRocktopus() {
    var roll1 = randomInteger(20);
    var roll2 = randomInteger(20);
    var stealth = 0;

    if (roll1 > roll2) {
        stealth = roll1 + 5;
    } else {
        stealth = roll2 + 5;
    }

    return 'A rocktopus is hiding in the dark. This creature is a giant octopus that has evolved to live and thrive on land. It can alter its coloration to appear  as a rock formation, and it tends to lurk in crevices and fissures, attacking smaller creatures that wander near.\n\n' +
        'DC ' + stealth + ' to spot the rocktopus.';
}

function madCreature() {
    var roll = randomInteger(4);
    var roll100 = randomInteger(100);
    var rollTreasure = randomInteger(20);
    var madness = '';
    var treasure = '';

    if (roll100 < 16) {
        madness = '“Being drunk keeps me sane.”';
    } else if (roll100 < 26) {
        madness = '“"I keep whatever I find."';
    } else if (roll100 < 31) {
        madness = '    “I try to become more like someone else I know—adopting his or her style of dress, mannerisms, and name.”';
    } else if (roll100 < 36) {
        madness = '“I must bend the truth, exaggerate, or outright lie to be interesting to other people.”';
    } else if (roll100 < 46) {
        madness = '	“Achieving my goal is the only thing of interest to me, and I’ll ignore everything else to pursue it.”';
    } else if (roll100 < 51) {
        madness = '“I find it hard to care about anything that goes on around me.”';
    } else if (roll100 < 56) {
        madness = '	“I don’t like the way people judge me all the time.”';
    } else if (roll100 < 71) {
        madness = '“I am the smartest, wisest, strongest, fastest, and most beautiful person I know.”';
    } else if (roll100 < 81) {
        madness = '“I am convinced that powerful enemies are hunting me, and their agents are everywhere I go. I am sure they’re watching me all the time.”';
    } else if (roll100 < 86) {
        madness = '“There’s only one person I can trust. And only I can see this Special friend.”';
    } else if (roll100 < 96) {
        madness = '“I can’t take anything seriously. The more serious the situation, the funnier I find it.”';
    } else {
        madness = '“I’ve discovered that I really like killing people.”';
    }

    if (rollTreasure < 10) {
        treasure =  'No posessions of note.';
    } else if (rollTreasure < 14) {
        treasure = 'A 10 gp gem';
    } else if (rollTreasure < 16) {
        treasure = 'A gold ring worth 25 gp';
    } else if (rollTreasure < 18) {
        treasure = 'An obsidian statuette of Lolth worth 100 gp';
    } else {
        treasure = 'A random magic item (roll once on Magic Item Table A in chapter 7 of the Dungeon Master’s Guide)';
    }


    switch(roll) {
        case 1:
            return 'The characters encounter a mad deep gnome.\n' +
                'Madness: ' + madness +
                '}} {{Treasure= ' + treasure + '}}';
            break;
        case 2:
            return 'The characters encounter a mad drow.\n' +
                'Madness:' + madness +
                '}} {{Treasure= ' + treasure + '}}';
            break;
        case 3:
            return 'The characters encounter a mad duergar.\n' +
                'Madness:' + madness +
                '}} {{Treasure= ' + treasure + '}}';
            break;
        case 4:
            return 'The characters encounter a mad stone giant.\n' +
                'Madness:' + madness +
                '}} {{Treasure= ' + treasure + '}}';
            break;
    }
}

function ochreJelly() {
    return 'As the characters move through a series of caves, they attract the attention of a ochre jelly. The ooze follows the characters, attacking when they stop to take their next rest. Characters in the back rank of the marching order who have a passive Wisdom (Perception) score of 14 or higher spot the ooze following them.'
}

function raiders() {
    var roll = randomInteger(3);
    var treasureRoll = randomInteger(20);
    var treasure = '';

    if (treasureRoll < 6) {
        treasure = 'No possessions of note.'
    } else if (treasureRoll < 11) {
        treasure = randomInteger(12) + ' 10gp gemstones in a pouch.'
    } else if (treasureRoll < 15) {
        treasure = randomInteger(12) + ' 50gp gemstones in a pouch.'
    } else if (treasureRoll < 18) {
        treasure = randomInteger(4) + ' torchstalks.'
    } else if (treasureRoll < 20) {
        treasure = randomInteger(4) + ' waterorbs.'
    } else {
        treasure = 'A random magic item (roll on Magic Item Table B in chapter 7 of the Dungeon Master’s Guide)';
    }

    switch(roll) {
        case 1:
            return 'This group of raiders from the surface ventured into the Underdark looking for riches and got lost.\n' +
                randomInteger(6) + ' human bandits and a bandit captain.\n\n' +
                'Leader Additional Treasure: ' + treasure;
            break;
        case 2:
            var goblinCount = randomInteger(4) + randomInteger(4);
            return 'This group of raiders from the surface ventured into the Underdark looking for riches and got lost.\n' +
                goblinCount + ' goblins and a goblin boss.\n\n' +
                'Leader Additional Treasure: ' + treasure;
            break;
        case 3:
            return 'This group of raiders from the surface ventured into the Underdark looking for riches and got lost.\n' +
                randomInteger(6) + ' orcs and an Eye of Gruumsh.\n\n' +
                'Leader Additional Treasure: ' + treasure;
            break;
    }


    return 'This group of raiders from the surface ventured into the Underdark looking for riches and got lost';
}

function scouts() {
    var roll = randomInteger(3);

    switch(roll){
        case 1:
            var hide = randomInteger(20) + 4;
            return 'A drow scout searching for escaped slaves has spotted the party. DC ' + hide + 'to spot. If undetected or he escapes, he takes away information regarding the group’s location. Pursuit level increases by 2.';
            break;
        case 2:
            return randomInteger(4) + ' myconoid adults in a scouting party. The myconid scouts are indifferent toward the party and unwilling to discuss their mission or their travels with the adventurers.';
            break;
        case 3:
            return randomInteger(6) + ' shield dwarf scouts. They are friendly and willing to give the party a day or two’s worth of food and water rations.';
            break;
    }
}

function societyOfBrilliance() {
    var roll = randomInteger(5);
    var societyMemberDescription = 'The Society of Brilliance is a sect of highly intelligent ' +
        'monsters that have banded together to solve all of the Underdark’s problems. ' +
        'The society is investigating areas suffused with faerzress to ascertain ' +
        'whether it has something to do with what the society fears is some kind of ' +
        '“demonic incursion.\n\n” ' +
        'Every member of the Society of Brilliance has an' +
        'alignment of neutral, an Intelligence of 18 (+4), and' +
        'fluency in multiple languages including Dwarvish,' +
        'Elvish, and Undercommon (although Grazilaxx' +
        'prefers to communicate using telepathy). Its statistics' +
        'are unchanged otherwise. Members are erudite and' +
        'talkative, preferring diplomacy and debate over violence' +
        '(though they defend themselves if attacked).\n\n' +
        'Each society member can cast the teleport spell once' +
        'per day, but the intended destination must be within 30' +
        'feet of another society member. This teleport effect can' +
        'be disrupted (see “Faerzress” earlier in the chapter),' +
        'which is how society members sometimes end up in far' +
        'corners of the Underdark, separated from their fellows.\n\n' +
        'Members of the Society of Brilliance are aware that' +
        'paths to the surface world exist but haven’t explored' +
        'any of them (their concerns are with the Underdark,' +
        'after all).\n\n' +
        'If the characters seem intent on reaching the' +
        'surface, a society member might suggest they look for' +
        'a guide in one of the Underdark’s larger settlements,' +
        'such as Blingdenstone or Gracklstugh. The society' +
        'member can provide detailed verbal directions that' +
        'characters can follow to reach whichever Underdark' +
        'settlement they desire. However, the society member' +
        'can’t guarantee that the route is safe. If characters' +
        'are searching for something else, the society member' +
        'provides whatever assistance it can.';

    switch(roll) {
        case 1:
            return 'The players encounter Y the derro savant, a member of the Society of Brilliance.\n\n' + societyMemberDescription;
            break;
        case 2:
            return 'The players encounter Blurg the orog, a member of the Society of Brilliance.\n\n' + societyMemberDescription;
            break;
        case 3:
            return 'The players encounter Grazilaxx the mind flayer, a member of the Society of Brilliance.\n\n' + societyMemberDescription;
            break;
        case 4:
            return 'The players encounter Skriss the troglodyte, a member of the Society of Brilliance.\n\n' + societyMemberDescription;
            break;
        case 5:
            return 'The players encounter Sloopidoop the kuo-toa archpriest, a member of the Society of Brilliance.\n\n' + societyMemberDescription;
            break;
    }
}

function sporeServant() {
    var roll = randomInteger(10);
    var sporeServantDescription = 'Creatures killed and reanimated by Zuggtmoy’s spores observe the characters as they pass by. The spore servants don’t communicate and don’t attack except in self-defense. (See Appendix C for details)';

    if (roll < 4) {
        return randomInteger(4) + ' drow spore servants.\n\n' + sporeServantDescription;
    } else if (roll < 7) {
        return randomInteger(6) + ' duergar spore servants.\n\n' + sporeServantDescription;
    } else if (roll < 9) {
        return randomInteger(4) + ' hook horror spore servants.\n\n' + sporeServantDescription;
    } else {
        return randomInteger(8) + ' quaggoth spore servants.\n\n' + sporeServantDescription;
    }
}

function traders() {
    var roll = randomInteger(4);
    var coinFlip = randomInteger(2);
    var count, provisions, riderCount, riders = '';

    switch(roll){
        case 1:
            count = randomInteger(4) + randomInteger(4);
            provisions = (randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4)) * count * 0.2;
            return count + ' deep gnome traders. They are willing to sell ' + provisions + ' days supplies of provisions for 5sp/day.';
            break;
        case 2:
            count = randomInteger(4) + randomInteger(4);
            provisions = (randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4)) * count * 0.2;
            riderCount = count/2;
            if (coinFlip === 1) {
                riders = riderCount + ' are riding giant lizards.\n\n'
            }

            return count + ' drow traders. They are willing to sell ' + provisions + ' days supplies of provisions for 5sp/day.\n' +
                riders +
                'Increase drow pursuit level by 1 if the traders are allowed to leave unharmed.';
            break;
        case 3:
            count = randomInteger(4) + randomInteger(4);
            provisions = (randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4)) * count * 0.2;
            riderCount = count/2;
            if (coinFlip === 1) {
                riders = riderCount + ' are riding male steeders.'

                if (randomInteger(2) === 1) {
                    riders += ' They are escorted by a duergar kavalrachni astride a female steeder.'
                }
            }

            return count + ' duergar traders. They are willing to sell ' + provisions + ' days supplies of provisions for 5sp/day.\n' +
                riders;
            break;
        case 4:
            count = randomInteger(4) + randomInteger(4);
            provisions = (randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4) + randomInteger(4)) * count * 0.2;
            return count + ' kuo-toa traders. They are willing to sell ' + provisions + ' days supplies of provisions for 5sp/day.';
            break;
    }
}
