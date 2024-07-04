Overview
The program aims to generate a dungeon map with multiple rooms that don't overlap, and it prints the map using different characters to represent different elements (e.g., walls, room numbers).

Step-by-Step Process
Define Constants:

Map dimensions: MAP_WIDTH, MAP_HEIGHT
Room size constraints: MIN_ROOM_SIZE, MAX_ROOM_SIZE
Maximum number of rooms: MAX_ROOMS
Helper Function: Random Integer Generator:

rand(min, max): Returns a random integer between min and max (inclusive).
Map Initialization:

createEmptyMap(width, height): Creates a 2D array (the map) filled with # characters, indicating empty spaces.
Check for Room Overlap:

doesRoomOverlap(map, x, y, roomWidth, roomHeight): Checks if placing a room at coordinates (x, y) with dimensions roomWidth x roomHeight would overlap with existing rooms. It checks one cell around the room as well to ensure no rooms are adjacent.
Place a Room:

placeRoom(map, x, y, roomWidth, roomHeight, roomNumber, rooms): Places a room on the map and marks its walls and interior. The room number is also placed inside the room. The room is added to the list of rooms.
Generate Dungeon Map:

generateDungeonMap(width, height, minRoomSize, maxRoomSize, maxRooms): Main function to generate the dungeon map.
Initializes the map.
Tries to place up to maxRooms rooms:
Generates a room with random dimensions and position.
Checks if the room overlaps with any existing rooms.
If no overlap, places the room on the map and stores its center coordinates.
After placing all rooms, sorts the rooms by their coordinates.
Updates the map with sorted room numbers.
Returns the final map.
Print the Map:

printMap(map): Prints the map to the console, using colors to differentiate between different types of cells:
#: Gray (empty space)
.: White (room interior)
_ and |: Yellow (walls)
Room numbers: Green
Main Execution:

Measures and prints the time taken to generate and print the dungeon map.
Calls generateDungeonMap with the specified constants.
Calls printMap to display the map.
Key Points
Random Room Generation: Each room is generated with random dimensions and position within specified constraints.
Overlap Checking: Ensures no rooms overlap by checking surrounding cells.
Sorting Rooms: Rooms are sorted by their coordinates to maintain a consistent numbering order.
Printing with Colors: Uses the chalk library to print the map with different colors for better visualization.
Potential Improvements
Performance Optimization: The nested loops used for placing rooms and checking overlaps could be optimized to improve performance, especially for larger maps or more rooms.
Error Handling: Add error handling for edge cases, such as not being able to place the specified number of rooms within the map constraints.

run dungeon.js for the technical assignment 
run dungeon_game.js for something extra fun :)

best regards,
amet onour



