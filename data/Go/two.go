package transport

import (
	"sync"
)

type swapConn struct {
	g        *gobConn // RW write, R+W read
	rlk, wlk sync.Mutex
	nsent    int64         // W read-write
	ackd     int64         // W read-write
	pipe     chan *linkMsg // W read-write
	gsr      int64         // RW write, W read
}

func makeSwapConn(g *gobConn, pipelining int) *swapConn {
	return &swapConn{
		g:     g,
		pipe:  make(chan *linkMsg, pipelining),
		nsent: 0,
		ackd:  -1,
		gsr:   -1,
	}
}

// Swap may return error if resending the unacknowledged pipe fails
func (c *swapConn) Swap(g *gobConn) error {
	panic("not finished")
	c.rlk.Lock()
	defer c.rlk.Unlock()

	c.wlk.Lock()
	defer c.wlk.Unlock()

	c.g = g
	return nil
}

func (c *swapConn) Close() error {
	c.rlk.Lock()
	defer c.rlk.Unlock()

	c.wlk.Lock()
	defer c.wlk.Unlock()

	// Check we haven't closed yet
	if c.g == nil {
		return ErrAlreadyClosed
	}
	c.g.Close()
	c.g = nil
	close(c.pipe)
	c.pipe = nil
	return nil
}