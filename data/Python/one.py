from tkinter import *
import random

# Creating a tkinter window object
root = Tk()
root.geometry("600x600")
root.title("Rock Paper Scissor Game")
root.config(bg='green')
win = 0
cpuwin = 0

# Game logic
comp_val = {
    "0": "Rock",
    "1": "Paper",
    "2": "Scissor"
}

# Turning on buttons for the user


def reset_game():
    rockButton["state"] = "active"
    paperButton["state"] = "active"
    ScissorsButton["state"] = "active"
    text1.config(text="Player			 ")
    text3.config(text="Computer")
    text4.config(text="")

# Turning off buttons for the user


def button_disable():
    rockButton["state"] = "disable"
    paperButton["state"] = "disable"
    ScissorsButton["state"] = "disable"

# If the player selected rock


def playerClickedRock():
    global win
    global cpuwin
    c_v = comp_val[str(random.randint(0, 2))]
    if c_v == "Rock":
        match_result = "Match Draw"
    elif c_v == "Scissor":
        win = win + 1
        match_result = "Player Win"
        # color change
        root['background'] = 'yellow'

    else:
        cpuwin = cpuwin + 1
        match_result = "Computer Win"
    text4.config(text=match_result)
    text1.config(text="Rock      ")
    text3.config(text=c_v)
    playerScoreText["text"] = "Player Score: "+str(win)
    button_disable()


root.mainloop()
