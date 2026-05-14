package ai

import "testing"

func TestHeuristicModeration_PhoneNumber(t *testing.T) {
	ok, _, matched := heuristicModeration("call me on 08012345678")
	if !matched {
		t.Fatalf("expected matched=true")
	}
	if ok {
		t.Fatalf("expected ok=false")
	}
}

func TestHeuristicModeration_Link(t *testing.T) {
	ok, _, matched := heuristicModeration("here is my link https://wa.me/2348012345678")
	if !matched {
		t.Fatalf("expected matched=true")
	}
	if ok {
		t.Fatalf("expected ok=false")
	}
}

func TestHeuristicModeration_Safe(t *testing.T) {
	ok, reason, matched := heuristicModeration("I can start today and finish in 2 hours.")
	if matched {
		t.Fatalf("expected matched=false")
	}
	if !ok {
		t.Fatalf("expected ok=true, reason=%q", reason)
	}
}

