package com.example.project1.data.pipeline;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


public class Pipe<T> {

    private List<Filter<T>> filterList = new ArrayList<>();

    public void addFilter(Filter<T> filter) {
        filterList.add(filter);
    }

    public T runFilter(T input) throws IOException, ParseException {
        for (Filter<T> filter : filterList) {
            input = filter.execute(input);
        }
        return input;
    }

}