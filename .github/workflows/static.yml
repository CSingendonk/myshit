local Interface = require("Interface")




-- Define Interface elements for the menu and game
local menuTitle = Interface.new()
local menuOptions = {}
local selectedOption = 1 -- Tracks the currently highlighted menu option
local gameState = "menu" -- Can be "menu", "play", "pause", or "instructions"
local pieces = {}
local mainTitle, movesDisplay, timeDisplay, winMessage
local grid, emptyTile, tileSize, moves, startTime, elapsedTime, gameWon

-- Function to initialize the puzzle
local function initializePuzzle()
    -- Puzzle initialization logic
    grid = {}
    emptyTile = { row = 4, col = 4 }
    tileSize = 100
    moves = 0
    gameWon = false
    startTime = love.timer.getTime()

    -- Initialize the grid with numbers 1 to 15
    local tiles = {}
    for i = 1, 15 do table.insert(tiles, i) end
    shuffle(tiles)

    local index = 1
    for row = 1, 4 do
        grid[row] = {}
        for col = 1, 4 do
            if not (row == 4 and col == 4) then
                grid[row][col] = tiles[index]
                index = index + 1
            else
                grid[row][col] = nil -- Empty tile
            end
        end
    end
end

-- Check if the puzzle is solved
function isPuzzleSolved()
    if (grid == nil) then
	    return
	end
    local solvedGrid = {}
    local index = 1
    for row = 1, 4 do
        solvedGrid[row] = {}
        for col = 1, 4 do
            if row == 4 and col == 4 then
                solvedGrid[row][col] = nil -- Empty tile position
            else
                solvedGrid[row][col] = index
                index = index + 1
            end
        end
    end

    -- Compare the current grid with the solved grid
    for row = 1, 4 do
        for col = 1, 4 do
            if grid[row][col] ~= solvedGrid[row][col] then
                return false -- Puzzle is not solved
            end
        end
    end
    return true -- Puzzle is solved
end

-- Shuffle function to randomize the tile positions
function shuffle(t)
    for i = #t, 2, -1 do
        local j = math.random(i)
        t[i], t[j] = t[j], t[i]
    end
end

-- Save game state to a file without using serpent
function saveGameState()
    local saveData = {
        grid = grid,
        emptyTile = emptyTile,
        moves = moves,
        startTime = startTime,
        gameWon = gameWon
    }

    -- Serialize the table into a string
    local serializedData = ""
    for key, value in pairs(saveData) do
        -- Convert table values to strings and concatenate them
        if type(value) == "table" then
            -- If the value is a table, serialize it manually
            serializedData = serializedData .. key .. "=" .. tableToString(value) .. "\n"
        else
            serializedData = serializedData .. key .. "=" .. tostring(value) .. "\n"
        end
    end

    -- Save the serialized string to a file
    love.filesystem.write("gameState.txt", serializedData)
end

-- Helper function to convert a table into a string
function tableToString(t)
    local result = "{"
    for k, v in pairs(t) do
        if type(v) == "table" then
            result = result .. k .. "=" .. tableToString(v) .. ","
        else
            result = result .. k .. "=" .. tostring(v) .. ","
        end
    end
    return result:sub(1, -2) .. "}"  -- Remove trailing comma and add closing bracket
end


-- Load game state from a file
function loadGameState()
    if love.filesystem.getInfo("gameState.txt") then
        local serializedData = love.filesystem.read("gameState.txt")

        -- Split the serialized string into lines
        local saveData = {}
        for line in serializedData:gmatch("[^\r\n]+") do
            local key, value = line:match("([^=]+)=([^=]+)")
            if key and value then
                -- If the value is a table, we'll need to parse it
                if value:sub(1, 1) == "{" then
                    saveData[key] = stringToTable(value)
                else
                    saveData[key] = tonumber(value) or value
                end
            end
        end

        -- Restore game state from loaded data
        grid = saveData.grid
        emptyTile = saveData.emptyTile
        moves = saveData.moves
        startTime = saveData.startTime
        gameWon = saveData.gameWon
    else
        initializePuzzle()  -- Default to initializing a new puzzle if no save file exists
    end
end

-- Helper function to convert a string back into a table
function stringToTable(s)
    local tbl = {}
    local pattern = "(%w+)=(%d+)"
    for k, v in s:gmatch(pattern) do
        tbl[k] = tonumber(v)
    end
    return tbl
end




-- Load the game
function love.load()
    -- Load game state if it exists
    loadGameState()

    -- Main menu setup
    menuTitle:setPosition(100, 50)
    menuTitle:setText("15-Puzzle Game")
    menuTitle:setFontSize(24)

    menuOptions = {
        Interface.new(),
        Interface.new(),
        Interface.new()
    }

    menuOptions[1]:setPosition(100, 100)
    menuOptions[1]:setText("Start Game")
    menuOptions[1]:setFontSize(18)

    menuOptions[2]:setPosition(100, 140)
    menuOptions[2]:setText("Instructions")
    menuOptions[2]:setFontSize(18)

    menuOptions[3]:setPosition(100, 180)
    menuOptions[3]:setText("Exit")
    menuOptions[3]:setFontSize(18)

    -- Gameplay UI setup
    mainTitle = Interface.new()
    movesDisplay = Interface.new()
    timeDisplay = Interface.new()
    winMessage = Interface.new()

    mainTitle:setPosition(50, 20)
    mainTitle:setText("15-Puzzle Game")
    mainTitle:setFontSize(20)

    movesDisplay:setPosition(50, 70)
    movesDisplay:setText("Moves: " .. moves)
    movesDisplay:setFontSize(16)

    timeDisplay:setPosition(50, 100)
    timeDisplay:setText("Time: 0.00s")
    timeDisplay:setFontSize(16)

    winMessage:setPosition(50, 150)
    winMessage:setText("")
    winMessage:setFontSize(16)
end




-- Draw the game or menu based on the game state
function love.draw()
    if gameState == "menu" then
        menuTitle:render()
        for i, option in ipairs(menuOptions) do
            if i == selectedOption then
                option:setColor(0, 1, 0) -- Highlight selected option in green
            else
                option:setColor(1, 1, 1) -- Default color
            end
            option:render()
        end
    elseif gameState == "play" then

        -- Render gameplay UI
        mainTitle:render()
        movesDisplay:render()
        timeDisplay:render()
        winMessage:render()

        -- Render the grid
        for row = 1, 4 do
            for col = 1, 4 do
                local x = (col - 1) * tileSize + 200
                local y = (row - 1) * tileSize + 50
                if grid[row][col] then
                    love.graphics.rectangle("line", x, y, tileSize, tileSize)
                    love.graphics.printf(
                        tostring(grid[row][col]),
                        x,
                        y + (tileSize / 2) - 10,
                        tileSize,
                        "center"
                    )
                else
                    love.graphics.rectangle("line", x, y, tileSize, tileSize)
                end
            end
        end
    elseif gameState == "instructions" then
        love.graphics.print("Instructions: Use arrow keys to move tiles.", 100, 100)
		love.graphics.print("Instructions: Press 'R' to randomly shuffle the tiles.", 100, 145)
        love.graphics.print("Instructions: Press 'S' to save the game.", 100, 190)
        love.graphics.print("Instructions: Press 'esc' to quit the game.", 100, 235)
        love.graphics.print("Press 'enter' to return to the menu.", 150, 280)
    end
end

-- Update the game
function love.update(dt)
    if gameState == "play" then
        -- Only update the game logic if the grid is properly initialized
        if grid then
            elapsedTime = love.timer.getTime() - startTime
            timeDisplay:setText(string.format("Time: %.2fs", elapsedTime))

            -- Check if the puzzle is solved and display the win message
            if isPuzzleSolved() and not gameWon then
                gameWon = true
                winMessage:setText("Congratulations! You solved the puzzle!")
            end
        end
    end
end


-- Handle key presses for menu and gameplay
function love.keypressed(key)
    if gameState == "menu" then
        if key == "up" then
            selectedOption = selectedOption > 1 and selectedOption - 1 or #menuOptions
        elseif key == "down" then
            selectedOption = selectedOption < #menuOptions and selectedOption + 1 or 1
        elseif key == "return" then
            if selectedOption == 1 then
                gameState = "play"
                initializePuzzle()
            elseif selectedOption == 2 then
                gameState = "instructions"
            elseif selectedOption == 3 then
                love.event.quit()
            end
        end
    elseif gameState == "instructions" then
        if key == "return" then
            gameState = "menu"
        end
    elseif gameState == "play" then
        if key == "return" then
            gameState = "menu"  -- Return to menu
        end
        if key == "escape" then
            love.event.quit()
        end
        if key == "up" or key == "down" or key == "left" or key == "right" then
            local newRow, newCol = emptyTile.row, emptyTile.col

            if key == "down" then newRow = newRow + 1 end
            if key == "up" then newRow = newRow - 1 end
            if key == "right" then newCol = newCol + 1 end
            if key == "left" then newCol = newCol - 1 end

            if newRow >= 1 and newRow <= 4 and newCol >= 1 and newCol <= 4 then
                grid[emptyTile.row][emptyTile.col], grid[newRow][newCol] =
                    grid[newRow][newCol], grid[emptyTile.row][emptyTile.col]
                emptyTile.row, emptyTile.col = newRow, newCol

                moves = moves + 1
                movesDisplay:setText("Moves: " .. moves)
            end
        end
		if key == "s" then
		    saveGameState()
		end
		if key == "r" then
		    initializePuzzle()
		end

    end
end
