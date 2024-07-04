import chalk from 'chalk';
import readline from 'readline';

//IMPORTANT: the corridor generation function is not reliable it does not always result in a fully navigable map

const MAP_WIDTH = 50;
const MAP_HEIGHT = 20;
const MIN_ROOM_SIZE = 4;
const MAX_ROOM_SIZE = 7;
const MAX_ROOMS = 10;


const SYMBOL_WALL_HORIZONTAL = '_';
const SYMBOL_WALL_VERTICAL = '|';
const SYMBOL_FLOOR = '.';
const SYMBOL_DOOR = '*';
const SYMBOL_TREASURE = '$';



// random number generator
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create 2d array poppulated with blank space('#')
function createEmptyMap(width, height) {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => '#'));
}

//check if room overlaps 
function doesRoomOverlap(map, x, y, roomWidth, roomHeight) {
    for (let i = y - 1; i <= y + roomHeight; i++) {
        for (let j = x - 1; j <= x + roomWidth; j++) {
            if (i < 0 || j < 0 || i >= map.length || j >= map[0].length || map[i][j] !== '#') {
                return true;
            }
        }
    }
    return false;
}

//place a room on the 2d array
function placeRoom(map, x, y, roomWidth, roomHeight, roomNumber, rooms) {
    const room = {
        x,
        y,
        width: roomWidth,
        height: roomHeight,
        number: roomNumber
    };

    //room number (top-left corner)
    const numberX = x + 1;
    const numberY = y + 1;

    // stringify room number
    const roomNumberStr = String(roomNumber);

    // insert walls to correct cells of array 
    for (let i = y; i < y + roomHeight; i++) {
        for (let j = x; j < x + roomWidth; j++) {
            if (i === y || i === y + roomHeight - 1) {
                map[i][j] = SYMBOL_WALL_HORIZONTAL;
            } else if (j === x || j === x + roomWidth - 1) {
                map[i][j] = SYMBOL_WALL_VERTICAL;
            } else {
                map[i][j] = SYMBOL_FLOOR;
            }
        }
    }

    // Randomly place treasures in the room
    const treasures = rand(0, 2); // Up to 2 treasures per room
    
   

    for (let k = 0; k < treasures; k++) {
        const tx = rand(x + 1, x + roomWidth - 2);
        const ty = rand(y + 1, y + roomHeight - 2);
        map[ty][tx] = SYMBOL_TREASURE;
        
    }

    // Add room number to the map at the top-left corner of the room
    for (let k = 0; k < roomNumberStr.length; k++) {
        map[numberY][numberX + k] = roomNumberStr[k];
    }

    // Add room to the rooms array
    rooms.push(room);
}
// Function to generate the dungeon map
function generateDungeonMap(width, height, minRoomSize, maxRoomSize, maxRooms) {
    const map = createEmptyMap(width, height);
    let roomNumber = 1;
    const roomCenters = [];
    const rooms = [];

    // Attempt to place each room up to maxRooms times
    while (rooms.length < maxRooms) {
        // Generate a room with random position and size
        const roomWidth = rand(minRoomSize, maxRoomSize);
        const roomHeight = rand(minRoomSize, maxRoomSize);
        const x = rand(1, width - roomWidth - 1);  // Adjusted to ensure room fits within grid
        const y = rand(1, height - roomHeight - 1);  // Adjusted to ensure room fits within grid

        // Check if the room overlaps with any existing rooms
        if (!doesRoomOverlap(map, x, y, roomWidth, roomHeight)) {
            // If it doesn't overlap, mark the area on the map and store room info
            placeRoom(map, x, y, roomWidth, roomHeight, roomNumber, rooms);
            roomCenters.push([Math.floor(x + roomWidth / 2), Math.floor(y + roomHeight / 2)]);
            roomNumber++;
        }
    }

    // Sort rooms based on their y-coordinate and then x-coordinate
    rooms.sort((a, b) => {
        if (a.y !== b.y) {
            return a.y - b.y; // Sort by y-coordinate
        } else {
            return a.x - b.x; // If y-coordinate is the same, sort by x-coordinate
        }
    });

    // Update the map with sorted room numbers
    rooms.forEach((room, index) => {
        placeRoom(map, room.x, room.y, room.width, room.height, index + 1, rooms); // index + 1 because roomNumber starts from 1
    });

    // Connect rooms with corridors
    connectRooms(map, roomCenters);

    return map;
}

// Function to connect rooms with corridors
function connectRooms(map, roomCenters) {
    for (let i = 0; i < roomCenters.length - 1; i++) {
        let [x1, y1] = roomCenters[i];
        let [x2, y2] = roomCenters[i + 1];
        
        // Connect rooms using a single path
        while (x1 !== x2 || y1 !== y2) {
            if (x1 !== x2) {
                if (map[y1][x1] === '#' || map[y1][x1] === '|') {
                    map[y1][x1] = '*';
                }
                x1 += (x2 > x1) ? 1 : -1;
            } else if (y1 !== y2) {
                if (map[y1][x1] === '#' || map[y1][x1] === '_') {
                    map[y1][x1] = '*';
                }
                y1 += (y2 > y1) ? 1 : -1;
            }
        }
    }
}

// Function to print the map with cursor (+) at specified position
function printMapWithCursor(map, cursorX, cursorY) {
    map.forEach((row, rowIndex) => {
        let mapRow = '';
        row.forEach((cell, colIndex) => {
            if (rowIndex === cursorY && colIndex === cursorX) {
                mapRow += chalk.red.bold('+');
            } else {
                switch (cell) {
                    case '#': mapRow += chalk.gray(cell); break; // Wall
                    case '.': mapRow += chalk.white(cell); break; // Floor
                    case '_': mapRow += chalk.yellow(cell); break; // Horizontal wall
                    case '|': mapRow += chalk.yellow(cell); break; // Vertical wall
                    case '*': mapRow += chalk.blue(cell); break; // Door or connection
                    case '$': mapRow += chalk.yellowBright(cell); break; // Treasure
                    default: mapRow += chalk.green(cell); break; // Room number or other symbols
                }
            }
        });
        console.log(mapRow);
    });
}

// Function to find a valid starting position inside a room
function findValidStartingPosition(map, startX, startY) {
    if (map[startY][startX] === '*' || map[startY][startX] ===  ".") {
        return { startX, startY };
    } else {
        
        for (let i = startY - 15; i <= startY + 15; i++) {
            for (let j = startX - 15; j <= startX + 15; j++) {
                // Check boundaries and if the cell is a room ('*')
                if (i >= 0 && i < map.length && j >= 0 && j < map[0].length && map[i][j] === '*'||i >= 0 && i < map.length && j >= 0 && j < map[0].length && map[i][j] === ".") {
                    return { startX: j, startY: i };
                }
            }
        }
        // If no valid position found, default to original start position
        return { startX, startY };
    }
}

// Function to handle keyboard input for navigation
function handleUserInput(map, cursorX, cursorY) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Enable raw mode to handle keystrokes immediately
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    // Find a valid starting position inside a room
    const { startX, startY } = findValidStartingPosition(map, cursorX, cursorY);
    let currentX = startX;
    let currentY = startY;

    // Display the map initially
    console.clear();
    printMapWithCursor(map, currentX, currentY);

    // Handle user input
    process.stdin.on('keypress', (str, key) => {
        // Process arrow keys for movement
        switch (key.name) {
            case 'q':
                console.log('Exiting...');
                rl.close();
                process.exit();
                break;
            case 'w': // Up
                if (currentY > 0 && (map[currentY - 1][currentX] === '*' || map[currentY - 1][currentX] === '.' || map[currentY - 1][currentX] === '$')) {
                    currentY--;
                    if (map[currentY][currentX] === '$') {
                        console.log("Found treasure!");
                        map[currentY][currentX] = '.';
                    }
                }
                break;
            case 's': // Down
                if (currentY < map.length - 1 && (map[currentY + 1][currentX] === '*' || map[currentY + 1][currentX] === '.' || map[currentY + 1][currentX] === '$')) {
                    currentY++;
                    if (map[currentY][currentX] === '$') {
                        console.log("Found treasure!");
                        map[currentY][currentX] = '.';
                    }
                }
                break;
            case 'a': // Left
                if (currentX > 0 && (map[currentY][currentX - 1] === '*' || map[currentY][currentX - 1] === '.' || map[currentY][currentX - 1] === '$')) {
                    currentX--;
                    if (map[currentY][currentX] === '$') {
                        console.log("Found treasure!");
                        map[currentY][currentX] = '.';
                    }
                }
                break;
            case 'd': // Right
                if (currentX < map[0].length - 1 && (map[currentY][currentX + 1] === '*' || map[currentY][currentX + 1] === '.' || map[currentY][currentX + 1] === '$')) {
                    currentX++;
                    if (map[currentY][currentX] === '$') {
                        console.log("Found treasure!");
                        map[currentY][currentX] = '.';
                    }
                }
                break;
            default:
                break;
        }
    
        // Clear console and print map with updated cursor position
        console.clear();
        printMapWithCursor(map, currentX, currentY);
    });

    // Close readline interface on exit
    rl.on('close', () => {
        console.log('Exiting...');
        process.exit();
    });
}
console.time("dungeon")
// Generate and print the dungeon map
const dungeonMap = generateDungeonMap(MAP_WIDTH, MAP_HEIGHT, MIN_ROOM_SIZE, MAX_ROOM_SIZE, MAX_ROOMS);
//printMapWithCursor(dungeonMap, startX, startY);

// Starting position for the cursor
const startX = 1;
const startY = 1;

// Enable user interaction
handleUserInput(dungeonMap, startX, startY);
console.timeEnd("dungeon")