#!/usr/bin/env python

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import tornado.gen
import socket

number_player = 0
connections = []

class WSHandler(tornado.websocket.WebSocketHandler):
    number_of_tic = 0
    board = ['' for i in range(9)]

    def open(self):
        global number_player
        connections.append(self)
        print 'new connection : ' + self.request.remote_ip;
        if number_player == 0:
            self.client_mark = 'X'
            number_player += 1
            self.write_message('m:X')
        elif number_player == 1:
            self.client_mark = 'O'
            number_player += 1
            self.write_message('m:O')
        else:
            self.write_message('a:Already 2 players are joined')
            

    def on_message(self, message):
        global number_player
        if message[:2] == 'n:':
            self.client_name = message[2:]
            print 'client name: %s' % self.client_name
            #print 'client mark: %s' % self.client_mark
            #print 'number of player: %s' % WSHandler.number_player
        elif message[:2] == 'p:':
            WSHandler.number_of_tic += 1
            self.client_position = int(message[2:])
            WSHandler.board[self.client_position - 1] = self.client_mark
            if WSHandler.number_of_tic > 4:
                winner = check_win(WSHandler.board)
                if winner != 'C':
                    reply = 'p:' + message[2:]
                    self.unicast_message(reply)
                    reply = 'w:The winner is ' + winner
                    print reply;
                    self.broadcast_message(reply)
                    number_player = 0
                elif WSHandler.number_of_tic == 9:
                    reply = 'w:No winner'
                    print reply;
                    self.broadcast_message(reply)
                    number_player = 0
                else:
                    reply = 'p:' + message[2:]
                    print reply;
                    self.unicast_message(reply)
            else:
                reply = 'p:' + message[2:]
                print reply;
                self.unicast_message(reply)
            print '%s : %d' % (self.client_mark, self.client_position)

    def on_close(self):
        print 'connection close'
        connections.remove(self)
        WSHandler.number_of_tic = 0
        WSHandler.board = ['' for i in range(9)]

    def check_origin(self, origin):
        return True

    def broadcast_message(self, message):
        for client in connections:
            client.write_message(message)
    #@tornado.gen.coroutine
    #@classmethod
    def unicast_message(self, message):
        for client in connections:
            if self.client_mark != client.client_mark:
                client.write_message(message)

#@staticmethod
def check_win(board):
    win_cond = ((1,2,3),(4,5,6),(7,8,9),(1,4,7),(2,5,8),(3,6,9),(1,5,9),(3,5,7))
    for each in win_cond:
        try:
            if board[each[0]-1] != '' and board[each[1]-1] != '' and  board[each[2]-1] != '':
                if board[each[0]-1] == board[each[1]-1] and board[each[1]-1] == board[each[2]-1]:
                    return board[each[0]-1]
        except:
            pass
    return 'C'

def make_application():
    return tornado.web.Application([(r'/', WSHandler), ])


if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(make_application())
    http_server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()

