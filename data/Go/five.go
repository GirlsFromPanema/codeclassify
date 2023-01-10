package seelog

import (
	"fmt"
	"testing"
)

var onlyMessageFormatForTest *formatter

func init() {
	var err error
	onlyMessageFormatForTest, err = NewFormatter("%Msg")
	if err != nil {
		fmt.Println("Can not create only message format: " + err.Error())
	}
}

func TestsplitDispatcher(t *testing.T) {
	writer1, _ := newBytesVerifier(t)
	writer2, _ := newBytesVerifier(t)
	spliter, err := NewSplitDispatcher(onlyMessageFormatForTest, []interface{}{writer1, writer2})
	if err != nil {
		t.Error(err)
		return
	}

	context, err := currentContext(nil)
	if err != nil {
		t.Error(err)
		return
	}

	bytes := []byte("Hello")

	writer1.ExpectBytes(bytes)
	writer2.ExpectBytes(bytes)
	spliter.Dispatch(string(bytes), TraceLvl, context, func(err error) {})
	writer1.MustNotExpect()
	writer2.MustNotExpect()
}