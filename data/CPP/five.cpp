#include <iostream>
#include <cstdlib>
using namespace std;

class Board
{
public:
    char board[3][3];
    char player, cpu;

    Board()
    {
        cout << "\nYour Mark: ";
        cin >> player;

        if (player == 'X')
            cpu = 'O';
        else if (player == 'O')
            cpu = 'X';
        else
        {
            cout << "TRY AGAIN!";
            Board();
        }

        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                board[i][j] = '-';
    }

    void Mark(int row, int col, char id)
    {
        board[row][col] = id;
    }

    void Display()
    {
        for (int i = 0; i < 3; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                cout << board[i][j] << "\t";
            }
            cout << "\n";
        }
    }

    char Winner()
    {
        for (int i = 0; i < 3; i++)
        {
            if ((board[i][0] == board[i][1] == board[i][2]) & (board[i][2] == 'X' | board[i][2] == 'O'))
                return board[i][0];
            else if ((board[0][i] == board[1][i] == board[2][i]) & (board[0][i] == 'X' | board[0][i] == 'O'))
                return board[0][i];
        }
        if ((board[0][0] == board[1][1] == board[2][2]) & (board[0][0] == 'X' | board[0][0] == 'O'))
            return board[0][0];
        else if ((board[0][2] == board[1][1] == board[2][0]) & (board[0][2] == 'X' | board[0][2] == 'O'))
            return board[0][2];

        return '-';
    }

    void WinCheck()
    {
        char w = Winner();

        if (w == player)
        {
            cout << "\nPLAYER WINS";
            exit(0);
        }
        else if (w == cpu)
        {
            cout << "\nCPU WINS!";
            exit(0);
        }
    }
};