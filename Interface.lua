-- Interface.lua
local Interface = {}

function Interface.new()
    local self = setmetatable({
        name = "",
        enabled = true,
        visible = true,
        x = 0,
        y = 0,
        text = "",  -- Add a text property for the interface elements
        fontSize = 14,  -- Default font size for rendering text
        color = {1, 1, 1}  -- Default color (white) for text
    }, {})

    -- Setters and getters for various properties
    function self:setName(name)
        self.name = name
    end

    function self:getName()
        return self.name
    end

    function self:setEnabled(enabled)
        self.enabled = enabled
    end

    function self:isEnabled()
        return self.enabled
    end

    function self:setVisible(visible)
        self.visible = visible
    end

    function self:isVisible()
        return self.visible
    end

    function self:setPosition(x, y)
        self.x = x
        self.y = y
    end

    function self:getText()
        return self.text
    end

    function self:setText(text)
        self.text = text
    end

    function self:setFontSize(size)
        self.fontSize = size
    end

    function self:getFontSize()
        return self.fontSize
    end

    function self:setColor(r, g, b)
        self.color = {r, g, b}
    end

    function self:getColor()
        return self.color
    end

    -- Render function for displaying UI elements
    function self:render()
        if self.visible then
            love.graphics.setColor(self.color)
            love.graphics.setFont(love.graphics.newFont(self.fontSize))
            love.graphics.print(self.text, self.x, self.y)
            love.graphics.setColor(1, 1, 1)  -- Reset color to white
        end
    end

    return self
end

return Interface
