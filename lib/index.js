"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePagination = void 0;
var react_1 = require("react");
var defaultGuard = function (state, a) { return state; };
var getReducer = function () { return function (state, action) {
    var _a;
    switch (action.type) {
        case 'SET-QUERY': {
            var _b = action.payload, query = _b.query, queryRef = _b.queryRef, firstDocRef = _b.firstDocRef, limit = _b.limit;
            return __assign(__assign({}, state), { query: query.limit(limit), queryRef: queryRef,
                firstDocRef: firstDocRef,
                limit: limit, isLoading: true });
        }
        case 'LOAD': {
            var value = action.payload.value;
            var docs = value.docs;
            var items = docs.map(function (doc) { return (__assign(__assign({}, doc.data()), { id: doc.id })); });
            var firstDoc = docs[0];
            var lastDoc = docs[docs.length - 1];
            var queryFromRef = state.queryRef ? state.queryRef.current : undefined;
            var prevQuery = queryFromRef && firstDoc ? queryFromRef.endBefore(firstDoc).limitToLast(state.limit) : state.lastQuery;
            var nextQuery = queryFromRef && lastDoc ? queryFromRef.startAfter(lastDoc).limit(state.limit) : state.nextQuery;
            var firstDocRef = state.firstDocRef;
            if (firstDocRef && firstDocRef.current === undefined) {
                firstDocRef.current = firstDoc;
            }
            return __assign(__assign({}, state), { docs: docs, lastQuery: items.length > 0 ? state.query : undefined, isLoading: false, firstDoc: firstDoc,
                firstDocRef: firstDocRef,
                lastDoc: lastDoc,
                prevQuery: prevQuery,
                nextQuery: nextQuery,
                items: items, isStart: (firstDoc && ((_a = firstDocRef === null || firstDocRef === void 0 ? void 0 : firstDocRef.current) === null || _a === void 0 ? void 0 : _a.isEqual(firstDoc))) || false, isEnd: items.length < state.limit });
        }
        case 'NEXT': {
            return __assign(__assign({}, state), { isLoading: true, query: state.nextQuery });
        }
        case 'PREV': {
            return __assign(__assign({}, state), { isLoading: true, query: state.prevQuery });
        }
        default: {
            return defaultGuard(state, action);
        }
    }
}; };
var initialState = {
    query: undefined,
    queryRef: undefined,
    lastQuery: undefined,
    firstDocRef: undefined,
    docs: [],
    firstDoc: undefined,
    lastDoc: undefined,
    prevQuery: undefined,
    nextQuery: undefined,
    items: [],
    isLoading: true,
    isStart: true,
    isEnd: false,
    limit: 10,
};
var usePagination = function (firestoreQuery, options) {
    var _a = react_1.useReducer(getReducer(), initialState), state = _a[0], dispatch = _a[1];
    var queryRef = react_1.useRef(undefined);
    var firstDocRef = react_1.useRef(undefined);
    var _b = options.limit, limit = _b === void 0 ? 10 : _b;
    react_1.useEffect(function () {
        if (firestoreQuery !== undefined) {
            if ((queryRef === null || queryRef === void 0 ? void 0 : queryRef.current) &&
                firestoreQuery.isEqual(queryRef.current) &&
                limit === state.limit) {
                return;
            }
            queryRef.current = firestoreQuery;
            firstDocRef.current = undefined;
            dispatch({
                type: 'SET-QUERY',
                payload: {
                    query: firestoreQuery,
                    queryRef: queryRef,
                    firstDocRef: firstDocRef,
                    limit: limit,
                },
            });
        }
    }, [firestoreQuery, limit, state.limit]);
    react_1.useEffect(function () {
        if (state.query !== undefined) {
            var unsubscribe_1 = state.query.onSnapshot(function (snap) {
                if (state.query) {
                    dispatch({
                        type: 'LOAD',
                        payload: { value: snap, query: state.query },
                    });
                }
            });
            return function () { return unsubscribe_1(); };
        }
    }, [state.query]);
    return {
        docs: state.docs,
        items: state.items,
        isLoading: state.isLoading,
        isStart: state.isStart,
        isEnd: state.isEnd,
        getPrev: function () { return dispatch({ type: 'PREV' }); },
        getNext: function () { return dispatch({ type: 'NEXT' }); },
    };
};
exports.usePagination = usePagination;
