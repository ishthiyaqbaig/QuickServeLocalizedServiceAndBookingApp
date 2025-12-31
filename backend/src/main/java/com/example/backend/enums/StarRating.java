package com.example.backend.enums;

public enum StarRating {
    ONE(1), TWO(2), THREE(3), FOUR(4), FIVE(5);

    public final int value;
    StarRating(int v) { this.value = v; }
}
