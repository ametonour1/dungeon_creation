
import chalk from 'chalk';

// Constants
const MAP_WIDTH = 50;
const MAP_HEIGHT = 20;
const MIN_ROOM_SIZE = 4;
const MAX_ROOM_SIZE = 7;
const MAX_ROOMS = 10;

// Helper function to generate random integers
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create 2d array populated with blank (#) 
function createEmptyMap(width, height) {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => '#'));
}

// check if room overlaps
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

// determine the cells that we need to insert the walls  
function placeRoom(map, x, y, roomWidth, roomHeight, roomNumber, rooms) {
    const room = {
        x,
        y,
        width: roomWidth,
        height: roomHeight,
        number: roomNumber
    };

    // room number
    const numberX = x + 1;
    const numberY = y + 1;

    // stringify number
    const roomNumberStr = String(roomNumber);

    // important: nested loop is inefficient and is potential hinderance on performance 
    // insert walls
    for (let i = y; i < y + roomHeight; i++) {
        for (let j = x; j < x + roomWidth; j++) {
            if (i === y || i === y + roomHeight - 1) {
                map[i][j] = '_';
            } else if (j === x || j === x + roomWidth - 1) {
                map[i][j] = '|';
            } else {
                map[i][j] = '.';
            }
        }
    }

    // Add room number 
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

    
    return map;
}

// Function to print the map to the console with colors
function printMap(map) {
    map.forEach(row => {
        console.log(row.map(cell => {
            switch (cell) {
                case '#': return chalk.gray(cell);
                case '.': return chalk.white(cell);
                case '_': return chalk.yellow(cell);
                case '|': return chalk.yellow(cell);
                case '*': return chalk.blue(cell);
                default: return chalk.green(cell);
            }
        }).join(''));
    });
}

// Generate and print the dungeon map
console.time("dungeon")
const dungeonMap = generateDungeonMap(MAP_WIDTH, MAP_HEIGHT, MIN_ROOM_SIZE, MAX_ROOM_SIZE, MAX_ROOMS);
printMap(dungeonMap);
console.timeEnd("dungeon")