/** @license React v16.12.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.React = factory();
})(this, function () {
  'use strict'; // TODO: this is special because it gets imported during build.

  var ReactVersion = '16.12.0'; // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.

  var hasSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
  // (unstable) APIs that have been removed. Can we remove the symbols?

  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
  var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
  var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
  var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }

    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }

    return null;
  }
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */

  /* eslint-disable no-unused-vars */


  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
  }

  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      } // Detect buggy property enumeration order in older V8 versions.
      // https://bugs.chromium.org/p/v8/issues/detail?id=4118


      var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

      test1[5] = 'de';

      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


      var test2 = {};

      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }

      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });

      if (order2.join('') !== '0123456789') {
        return false;
      } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });

      if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
        return false;
      }

      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;

    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);

        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }

    return to;
  }; // Do not require this module directly! Use normal `invariant` calls with
  // template literal strings. The messages will be replaced with error codes
  // during build.

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  /**
   * Forked from fbjs/warning:
   * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
   *
   * Only change is we use console.warn instead of console.error,
   * and do nothing when 'console' is not supported.
   * This really simplifies the code.
   * ---
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var lowPriorityWarningWithoutStack = function () {};

  {
    var printWarning = function (format) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });

      if (typeof console !== 'undefined') {
        console.warn(message);
      }

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    lowPriorityWarningWithoutStack = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(void 0, [format].concat(args));
      }
    };
  }
  var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;
  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warningWithoutStack = function () {};

  {
    warningWithoutStack = function (condition, format) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (args.length > 8) {
        // Check before the condition to catch violations early.
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }

      if (condition) {
        return;
      }

      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610

        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {}
    };
  }
  var warningWithoutStack$1 = warningWithoutStack;
  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + "." + callerName;

      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }

      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }
  /**
   * This is the abstract API for an update queue.
   */


  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };
  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }
  /**
   * Base class helpers for the updating state of a component.
   */

  function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};
  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */

  Component.prototype.setState = function (partialState, callback) {
    if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
      {
        throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      }
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */


  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */


  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };

    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          lowPriorityWarningWithoutStack$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };

    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}

  ComponentDummy.prototype = Component.prototype;
  /**
   * Convenience component with default shallow equality check for sCU.
   */

  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

  objectAssign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true; // an immutable object with a single mutable value

  function createRef() {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }
  /**
   * Keeps track of the current dispatcher.
   */


  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };
  /**
   * Keeps track of the current batch's configuration such as how long an update
   * should suspend for if it needs to.
   */

  var ReactCurrentBatchConfig = {
    suspense: null
  };
  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */

  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };
  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

  var describeComponentFrame = function (name, source, ownerName) {
    var sourceInfo = '';

    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, '');
      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);

          if (match) {
            var pathBeforeSlash = match[1];

            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
              fileName = folderName + '/' + fileName;
            }
          }
        }
      }
      sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
    } else if (ownerName) {
      sourceInfo = ' (created by ' + ownerName + ')';
    }

    return '\n    in ' + (name || 'Unknown') + sourceInfo;
  };

  var Resolved = 1;

  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }

    {
      if (typeof type.tag === 'number') {
        warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }

    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }

    if (typeof type === 'string') {
      return type;
    }

    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';

      case REACT_PORTAL_TYPE:
        return 'Portal';

      case REACT_PROFILER_TYPE:
        return "Profiler";

      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';

      case REACT_SUSPENSE_TYPE:
        return 'Suspense';

      case REACT_SUSPENSE_LIST_TYPE:
        return 'SuspenseList';
    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';

        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';

        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');

        case REACT_MEMO_TYPE:
          return getComponentName(type.type);

        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);

            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }

            break;
          }
      }
    }

    return null;
  }

  var ReactDebugCurrentFrame = {};
  var currentlyValidatingElement = null;

  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer.
    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = ''; // Add an extra top frame while an element is being validated

      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      } // Delegate to the injected renderer-specific implementation


      var impl = ReactDebugCurrentFrame.getCurrentStack;

      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }
  /**
   * Used by act() to track whether you're inside an act() scope.
   */

  var IsSomeRendererActing = {
    current: false
  };
  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentBatchConfig: ReactCurrentBatchConfig,
    ReactCurrentOwner: ReactCurrentOwner,
    IsSomeRendererActing: IsSomeRendererActing,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign
  };
  {
    objectAssign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }
  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = warningWithoutStack$1;
  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }

      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum(); // eslint-disable-next-line react-internal/warning-and-invariant-args

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(void 0, [false, format + '%s'].concat(args, [stack]));
    };
  }
  var warning$1 = warning;
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };
  var specialPropKeyWarningShown;
  var specialPropRefWarningShown;

  function hasValidRef(config) {
    {
      if (hasOwnProperty$1.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty$1.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, instanceof check
   * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} props
   * @param {*} key
   * @param {string|object} ref
   * @param {*} owner
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @internal
   */


  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // Record the component responsible for creating this element.
      _owner: owner
    };
    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.

      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      }); // self and source are DEV only properties.

      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      }); // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.

      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });

      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }
    return element;
  };
  /**
   * https://github.com/reactjs/rfcs/pull/107
   * @param {*} type
   * @param {object} props
   * @param {string} key
   */

  /**
   * https://github.com/reactjs/rfcs/pull/107
   * @param {*} type
   * @param {object} props
   * @param {string} key
   */


  function jsxDEV(type, config, maybeKey, source, self) {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.

    if (maybeKey !== undefined) {
      key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
    } // Remaining properties are added to a new props object


    for (propName in config) {
      if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */


  function createElement(type, config, children) {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }

      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }

        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
  /**
   * Return a function that produces ReactElements of a given type.
   * See https://reactjs.org/docs/react-api.html#createfactory
   */


  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
    return newElement;
  }
  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */


  function cloneElement(element, config, children) {
    if (!!(element === null || element === undefined)) {
      {
        throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
      }
    }

    var propName; // Original props are copied

    var props = objectAssign({}, element.props); // Reserved names are extracted

    var key = element.key;
    var ref = element.ref; // Self is preserved since the owner is preserved.

    var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.

    var source = element._source; // Owner will be preserved, unless ref is overridden

    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }

      if (hasValidKey(config)) {
        key = '' + config.key;
      } // Remaining properties override existing props


      var defaultProps;

      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }

      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }
  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */


  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';
  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });
    return '$' + escapedString;
  }
  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */


  var didWarnAboutMaps = false;
  var userProvidedKeyEscapeRegex = /\/+/g;

  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];

  function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }

  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;

    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }
  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */


  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;

        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }

      }
    }

    if (invokeCallback) {
      callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child;
    var nextName;
    var subtreeCount = 0; // Count of children found in the current subtree.

    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);

      if (typeof iteratorFn === 'function') {
        {
          // Warn about using Maps as children
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
            didWarnAboutMaps = true;
          }
        }
        var iterator = iteratorFn.call(children);
        var step;
        var ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === 'object') {
        var addendum = '';
        {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = '' + children;
        {
          {
            throw Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ")." + addendum);
          }
        }
      }
    }

    return subtreeCount;
  }
  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */


  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }
  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */


  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof component === 'object' && component !== null && component.key != null) {
      // Explicit key
      return escape(component.key);
    } // Implicit key determined by the index in the set


    return index.toString(36);
  }

  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func,
        context = bookKeeping.context;
    func.call(context, child, bookKeeping.count++);
  }
  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */


  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }

    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;
    var mappedChild = func.call(context, child, bookKeeping.count++);

    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }

      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = '';

    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }

    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }
  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */


  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }

    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }
  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */


  function countChildren(children) {
    return traverseAllChildren(children, function () {
      return null;
    }, null);
  }
  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */


  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }
  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */


  function onlyChild(children) {
    if (!isValidElement(children)) {
      {
        throw Error("React.Children.only expected to receive a single React element child.");
      }
    }

    return children;
  }

  function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };
    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };
    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;
    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }

            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }

            return context.Consumer;
          }
        }
      }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

      context.Consumer = Consumer;
    }
    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }
    return context;
  }

  function lazy(ctor) {
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };
    {
      // In production, this would just set it on the object.
      var defaultProps;
      var propTypes;
      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            defaultProps = newDefaultProps; // Match production behavior more closely:

            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            propTypes = newPropTypes; // Match production behavior more closely:

            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }
    return lazyType;
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        !( // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
      }
    }
    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };
  }

  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  function resolveDispatcher() {
    var dispatcher = ReactCurrentDispatcher.current;

    if (!(dispatcher !== null)) {
      {
        throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.");
      }
    }

    return dispatcher;
  }

  function useContext(Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();
    {
      !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0; // TODO: add a more generic warning for invalid values.

      if (Context._context !== undefined) {
        var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.

        if (realContext.Consumer === Context) {
          warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }
    return dispatcher.useContext(Context, unstable_observedBits);
  }

  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }

  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }

  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }

  function useEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }

  function useLayoutEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }

  function useCallback(callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }

  function useMemo(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }

  function useImperativeHandle(ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, inputs);
  }

  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }

  var emptyObject$1 = {};

  function useResponder(responder, listenerProps) {
    var dispatcher = resolveDispatcher();
    {
      if (responder == null || responder.$$typeof !== REACT_RESPONDER_TYPE) {
        warning$1(false, 'useResponder: invalid first argument. Expected an event responder, but instead got %s', responder);
        return;
      }
    }
    return dispatcher.useResponder(responder, listenerProps || emptyObject$1);
  }

  function useTransition(config) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useTransition(config);
  }

  function useDeferredValue(value, config) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDeferredValue(value, config);
  }

  function withSuspenseConfig(scope, config) {
    var previousConfig = ReactCurrentBatchConfig.suspense;
    ReactCurrentBatchConfig.suspense = config === undefined ? null : config;

    try {
      scope();
    } finally {
      ReactCurrentBatchConfig.suspense = previousConfig;
    }
  }
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */


  var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var printWarning$1 = function () {};

  {
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
    var has = Function.call.bind(Object.prototype.hasOwnProperty);

    printWarning$1 = function (text) {
      var message = 'Warning: ' + text;

      if (typeof console !== 'undefined') {
        console.error(message);
      }

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }
  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */

  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (has(typeSpecs, typeSpecName)) {
          var error; // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.

          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.');
              err.name = 'Invariant Violation';
              throw err;
            }

            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }

          if (error && !(error instanceof Error)) {
            printWarning$1((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
          }

          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;
            var stack = getStack ? getStack() : '';
            printWarning$1('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
          }
        }
      }
    }
  }
  /**
   * Resets warning cache when testing.
   *
   * @private
   */


  checkPropTypes.resetWarningCache = function () {
    {
      loggedTypeFailures = {};
    }
  };

  var checkPropTypes_1 = checkPropTypes;
  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  var propTypesMisspellWarningShown;
  {
    propTypesMisspellWarningShown = false;
  }
  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }

  function getSourceInfoErrorAddendum(source) {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }

  function getSourceInfoErrorAddendumForProps(elementProps) {
    if (elementProps !== null && elementProps !== undefined) {
      return getSourceInfoErrorAddendum(elementProps.__source);
    }

    return '';
  }
  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */


  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */


  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
    }

    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }
  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */


  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }

    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */


  function validatePropTypes(element) {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var name = getComponentName(type);
    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes_1(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function') {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }
  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */


  function validateFragmentProps(fragment) {
    setCurrentlyValidatingElement(fragment);
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
        break;
      }
    }

    if (fragment.ref !== null) {
      warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }

  function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            warning$1(false, 'React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    if (hasOwnProperty$2.call(props, 'key')) {
      warning$1(false, 'React.jsx: Spreading a key to JSX is a deprecated pattern. ' + 'Explicitly pass a key after spreading props in your JSX call. ' + 'E.g. <ComponentName {...props} key={key} />');
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  } // These two functions exist to still get child warnings in dev
  // even with the prod transform. This means that jsxDEV is purely
  // opt-in behavior for better messages but that we won't stop
  // giving you warnings if you use production apis.


  function jsxWithValidationStatic(type, props, key) {
    return jsxWithValidation(type, props, key, true);
  }

  function jsxWithValidationDynamic(type, props, key) {
    return jsxWithValidation(type, props, key, false);
  }

  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendumForProps(props);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }

  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type; // Legacy hook: remove it

    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarningWithoutStack$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }
    return validatedFactory;
  }

  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);

    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }

    validatePropTypes(newElement);
    return newElement;
  }

  var enableSchedulerDebugging = false;
  var enableIsInputPending = false;
  var enableProfiling = true;
  var requestHostCallback;
  var requestHostTimeout;
  var cancelHostTimeout;
  var shouldYieldToHost;
  var requestPaint;
  var getCurrentTime;
  var forceFrameRate;

  if ( // If Scheduler runs in a non-DOM environment, it falls back to a naive
  // implementation using setTimeout.
  typeof window === 'undefined' || // Check if MessageChannel is supported, too.
  typeof MessageChannel !== 'function') {
    // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
    // fallback to a naive implementation.
    var _callback = null;
    var _timeoutID = null;

    var _flushCallback = function () {
      if (_callback !== null) {
        try {
          var currentTime = getCurrentTime();
          var hasRemainingTime = true;

          _callback(hasRemainingTime, currentTime);

          _callback = null;
        } catch (e) {
          setTimeout(_flushCallback, 0);
          throw e;
        }
      }
    };

    var initialTime = Date.now();

    getCurrentTime = function () {
      return Date.now() - initialTime;
    };

    requestHostCallback = function (cb) {
      if (_callback !== null) {
        // Protect against re-entrancy.
        setTimeout(requestHostCallback, 0, cb);
      } else {
        _callback = cb;
        setTimeout(_flushCallback, 0);
      }
    };

    requestHostTimeout = function (cb, ms) {
      _timeoutID = setTimeout(cb, ms);
    };

    cancelHostTimeout = function () {
      clearTimeout(_timeoutID);
    };

    shouldYieldToHost = function () {
      return false;
    };

    requestPaint = forceFrameRate = function () {};
  } else {
    // Capture local references to native APIs, in case a polyfill overrides them.
    var performance = window.performance;
    var _Date = window.Date;
    var _setTimeout = window.setTimeout;
    var _clearTimeout = window.clearTimeout;

    if (typeof console !== 'undefined') {
      // TODO: Scheduler no longer requires these methods to be polyfilled. But
      // maybe we want to continue warning if they don't exist, to preserve the
      // option to rely on it in the future?
      var requestAnimationFrame = window.requestAnimationFrame;
      var cancelAnimationFrame = window.cancelAnimationFrame; // TODO: Remove fb.me link

      if (typeof requestAnimationFrame !== 'function') {
        console.error("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
      }

      if (typeof cancelAnimationFrame !== 'function') {
        console.error("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
      }
    }

    if (typeof performance === 'object' && typeof performance.now === 'function') {
      getCurrentTime = function () {
        return performance.now();
      };
    } else {
      var _initialTime = _Date.now();

      getCurrentTime = function () {
        return _Date.now() - _initialTime;
      };
    }

    var isMessageLoopRunning = false;
    var scheduledHostCallback = null;
    var taskTimeoutID = -1; // Scheduler periodically yields in case there is other work on the main
    // thread, like user events. By default, it yields multiple times per frame.
    // It does not attempt to align with frame boundaries, since most tasks don't
    // need to be frame aligned; for those that do, use requestAnimationFrame.

    var yieldInterval = 5;
    var deadline = 0; // TODO: Make this configurable
    // TODO: Adjust this based on priority?

    var maxYieldInterval = 300;
    var needsPaint = false;

    if (enableIsInputPending && navigator !== undefined && navigator.scheduling !== undefined && navigator.scheduling.isInputPending !== undefined) {
      var scheduling = navigator.scheduling;

      shouldYieldToHost = function () {
        var currentTime = getCurrentTime();

        if (currentTime >= deadline) {
          // There's no time left. We may want to yield control of the main
          // thread, so the browser can perform high priority tasks. The main ones
          // are painting and user input. If there's a pending paint or a pending
          // input, then we should yield. But if there's neither, then we can
          // yield less often while remaining responsive. We'll eventually yield
          // regardless, since there could be a pending paint that wasn't
          // accompanied by a call to `requestPaint`, or other main thread tasks
          // like network events.
          if (needsPaint || scheduling.isInputPending()) {
            // There is either a pending paint or a pending input.
            return true;
          } // There's no pending input. Only yield if we've reached the max
          // yield interval.


          return currentTime >= maxYieldInterval;
        } else {
          // There's still time left in the frame.
          return false;
        }
      };

      requestPaint = function () {
        needsPaint = true;
      };
    } else {
      // `isInputPending` is not available. Since we have no way of knowing if
      // there's pending input, always yield at the end of the frame.
      shouldYieldToHost = function () {
        return getCurrentTime() >= deadline;
      }; // Since we yield every frame regardless, `requestPaint` has no effect.


      requestPaint = function () {};
    }

    forceFrameRate = function (fps) {
      if (fps < 0 || fps > 125) {
        console.error('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing framerates higher than 125 fps is not unsupported');
        return;
      }

      if (fps > 0) {
        yieldInterval = Math.floor(1000 / fps);
      } else {
        // reset the framerate
        yieldInterval = 5;
      }
    };

    var performWorkUntilDeadline = function () {
      if (scheduledHostCallback !== null) {
        var currentTime = getCurrentTime(); // Yield after `yieldInterval` ms, regardless of where we are in the vsync
        // cycle. This means there's always time remaining at the beginning of
        // the message event.

        deadline = currentTime + yieldInterval;
        var hasTimeRemaining = true;

        try {
          var hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);

          if (!hasMoreWork) {
            isMessageLoopRunning = false;
            scheduledHostCallback = null;
          } else {
            // If there's more work, schedule the next message event at the end
            // of the preceding one.
            port.postMessage(null);
          }
        } catch (error) {
          // If a scheduler task throws, exit the current browser task so the
          // error can be observed.
          port.postMessage(null);
          throw error;
        }
      } else {
        isMessageLoopRunning = false;
      } // Yielding to the browser will give it a chance to paint, so we can
      // reset this.


      needsPaint = false;
    };

    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;

    requestHostCallback = function (callback) {
      scheduledHostCallback = callback;

      if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        port.postMessage(null);
      }
    };

    requestHostTimeout = function (callback, ms) {
      taskTimeoutID = _setTimeout(function () {
        callback(getCurrentTime());
      }, ms);
    };

    cancelHostTimeout = function () {
      _clearTimeout(taskTimeoutID);

      taskTimeoutID = -1;
    };
  }

  function push(heap, node) {
    var index = heap.length;
    heap.push(node);
    siftUp(heap, node, index);
  }

  function peek(heap) {
    var first = heap[0];
    return first === undefined ? null : first;
  }

  function pop(heap) {
    var first = heap[0];

    if (first !== undefined) {
      var last = heap.pop();

      if (last !== first) {
        heap[0] = last;
        siftDown(heap, last, 0);
      }

      return first;
    } else {
      return null;
    }
  }

  function siftUp(heap, node, i) {
    var index = i;

    while (true) {
      var parentIndex = Math.floor((index - 1) / 2);
      var parent = heap[parentIndex];

      if (parent !== undefined && compare(parent, node) > 0) {
        // The parent is larger. Swap positions.
        heap[parentIndex] = node;
        heap[index] = parent;
        index = parentIndex;
      } else {
        // The parent is smaller. Exit.
        return;
      }
    }
  }

  function siftDown(heap, node, i) {
    var index = i;
    var length = heap.length;

    while (index < length) {
      var leftIndex = (index + 1) * 2 - 1;
      var left = heap[leftIndex];
      var rightIndex = leftIndex + 1;
      var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

      if (left !== undefined && compare(left, node) < 0) {
        if (right !== undefined && compare(right, left) < 0) {
          heap[index] = right;
          heap[rightIndex] = node;
          index = rightIndex;
        } else {
          heap[index] = left;
          heap[leftIndex] = node;
          index = leftIndex;
        }
      } else if (right !== undefined && compare(right, node) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        // Neither child is smaller. Exit.
        return;
      }
    }
  }

  function compare(a, b) {
    // Compare sort index first, then task id.
    var diff = a.sortIndex - b.sortIndex;
    return diff !== 0 ? diff : a.id - b.id;
  } // TODO: Use symbols?


  var NoPriority = 0;
  var ImmediatePriority = 1;
  var UserBlockingPriority = 2;
  var NormalPriority = 3;
  var LowPriority = 4;
  var IdlePriority = 5;
  var runIdCounter = 0;
  var mainThreadIdCounter = 0;
  var profilingStateSize = 4;
  var sharedProfilingBuffer = enableProfiling ? // $FlowFixMe Flow doesn't know about SharedArrayBuffer
  typeof SharedArrayBuffer === 'function' ? new SharedArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) : // $FlowFixMe Flow doesn't know about ArrayBuffer
  typeof ArrayBuffer === 'function' ? new ArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) : null // Don't crash the init path on IE9
  : null;
  var profilingState = enableProfiling && sharedProfilingBuffer !== null ? new Int32Array(sharedProfilingBuffer) : []; // We can't read this but it helps save bytes for null checks

  var PRIORITY = 0;
  var CURRENT_TASK_ID = 1;
  var CURRENT_RUN_ID = 2;
  var QUEUE_SIZE = 3;

  if (enableProfiling) {
    profilingState[PRIORITY] = NoPriority; // This is maintained with a counter, because the size of the priority queue
    // array might include canceled tasks.

    profilingState[QUEUE_SIZE] = 0;
    profilingState[CURRENT_TASK_ID] = 0;
  } // Bytes per element is 4


  var INITIAL_EVENT_LOG_SIZE = 131072;
  var MAX_EVENT_LOG_SIZE = 524288; // Equivalent to 2 megabytes

  var eventLogSize = 0;
  var eventLogBuffer = null;
  var eventLog = null;
  var eventLogIndex = 0;
  var TaskStartEvent = 1;
  var TaskCompleteEvent = 2;
  var TaskErrorEvent = 3;
  var TaskCancelEvent = 4;
  var TaskRunEvent = 5;
  var TaskYieldEvent = 6;
  var SchedulerSuspendEvent = 7;
  var SchedulerResumeEvent = 8;

  function logEvent(entries) {
    if (eventLog !== null) {
      var offset = eventLogIndex;
      eventLogIndex += entries.length;

      if (eventLogIndex + 1 > eventLogSize) {
        eventLogSize *= 2;

        if (eventLogSize > MAX_EVENT_LOG_SIZE) {
          console.error("Scheduler Profiling: Event log exceeded maximum size. Don't " + 'forget to call `stopLoggingProfilingEvents()`.');
          stopLoggingProfilingEvents();
          return;
        }

        var newEventLog = new Int32Array(eventLogSize * 4);
        newEventLog.set(eventLog);
        eventLogBuffer = newEventLog.buffer;
        eventLog = newEventLog;
      }

      eventLog.set(entries, offset);
    }
  }

  function startLoggingProfilingEvents() {
    eventLogSize = INITIAL_EVENT_LOG_SIZE;
    eventLogBuffer = new ArrayBuffer(eventLogSize * 4);
    eventLog = new Int32Array(eventLogBuffer);
    eventLogIndex = 0;
  }

  function stopLoggingProfilingEvents() {
    var buffer = eventLogBuffer;
    eventLogSize = 0;
    eventLogBuffer = null;
    eventLog = null;
    eventLogIndex = 0;
    return buffer;
  }

  function markTaskStart(task, ms) {
    if (enableProfiling) {
      profilingState[QUEUE_SIZE]++;

      if (eventLog !== null) {
        // performance.now returns a float, representing milliseconds. When the
        // event is logged, it's coerced to an int. Convert to microseconds to
        // maintain extra degrees of precision.
        logEvent([TaskStartEvent, ms * 1000, task.id, task.priorityLevel]);
      }
    }
  }

  function markTaskCompleted(task, ms) {
    if (enableProfiling) {
      profilingState[PRIORITY] = NoPriority;
      profilingState[CURRENT_TASK_ID] = 0;
      profilingState[QUEUE_SIZE]--;

      if (eventLog !== null) {
        logEvent([TaskCompleteEvent, ms * 1000, task.id]);
      }
    }
  }

  function markTaskCanceled(task, ms) {
    if (enableProfiling) {
      profilingState[QUEUE_SIZE]--;

      if (eventLog !== null) {
        logEvent([TaskCancelEvent, ms * 1000, task.id]);
      }
    }
  }

  function markTaskErrored(task, ms) {
    if (enableProfiling) {
      profilingState[PRIORITY] = NoPriority;
      profilingState[CURRENT_TASK_ID] = 0;
      profilingState[QUEUE_SIZE]--;

      if (eventLog !== null) {
        logEvent([TaskErrorEvent, ms * 1000, task.id]);
      }
    }
  }

  function markTaskRun(task, ms) {
    if (enableProfiling) {
      runIdCounter++;
      profilingState[PRIORITY] = task.priorityLevel;
      profilingState[CURRENT_TASK_ID] = task.id;
      profilingState[CURRENT_RUN_ID] = runIdCounter;

      if (eventLog !== null) {
        logEvent([TaskRunEvent, ms * 1000, task.id, runIdCounter]);
      }
    }
  }

  function markTaskYield(task, ms) {
    if (enableProfiling) {
      profilingState[PRIORITY] = NoPriority;
      profilingState[CURRENT_TASK_ID] = 0;
      profilingState[CURRENT_RUN_ID] = 0;

      if (eventLog !== null) {
        logEvent([TaskYieldEvent, ms * 1000, task.id, runIdCounter]);
      }
    }
  }

  function markSchedulerSuspended(ms) {
    if (enableProfiling) {
      mainThreadIdCounter++;

      if (eventLog !== null) {
        logEvent([SchedulerSuspendEvent, ms * 1000, mainThreadIdCounter]);
      }
    }
  }

  function markSchedulerUnsuspended(ms) {
    if (enableProfiling) {
      if (eventLog !== null) {
        logEvent([SchedulerResumeEvent, ms * 1000, mainThreadIdCounter]);
      }
    }
  }
  /* eslint-disable no-var */
  // Math.pow(2, 30) - 1
  // 0b111111111111111111111111111111


  var maxSigned31BitInt = 1073741823; // Times out immediately

  var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

  var USER_BLOCKING_PRIORITY = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5000;
  var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

  var IDLE_PRIORITY = maxSigned31BitInt; // Tasks are stored on a min heap

  var taskQueue = [];
  var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

  var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.

  var isSchedulerPaused = false;
  var currentTask = null;
  var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrancy.

  var isPerformingWork = false;
  var isHostCallbackScheduled = false;
  var isHostTimeoutScheduled = false;

  function advanceTimers(currentTime) {
    // Check for tasks that are no longer delayed and add them to the queue.
    var timer = peek(timerQueue);

    while (timer !== null) {
      if (timer.callback === null) {
        // Timer was cancelled.
        pop(timerQueue);
      } else if (timer.startTime <= currentTime) {
        // Timer fired. Transfer to the task queue.
        pop(timerQueue);
        timer.sortIndex = timer.expirationTime;
        push(taskQueue, timer);

        if (enableProfiling) {
          markTaskStart(timer, currentTime);
          timer.isQueued = true;
        }
      } else {
        // Remaining timers are pending.
        return;
      }

      timer = peek(timerQueue);
    }
  }

  function handleTimeout(currentTime) {
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);

    if (!isHostCallbackScheduled) {
      if (peek(taskQueue) !== null) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      } else {
        var firstTimer = peek(timerQueue);

        if (firstTimer !== null) {
          requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
      }
    }
  }

  function flushWork(hasTimeRemaining, initialTime) {
    if (enableProfiling) {
      markSchedulerUnsuspended(initialTime);
    } // We'll need a host callback the next time work is scheduled.


    isHostCallbackScheduled = false;

    if (isHostTimeoutScheduled) {
      // We scheduled a timeout but it's no longer needed. Cancel it.
      isHostTimeoutScheduled = false;
      cancelHostTimeout();
    }

    isPerformingWork = true;
    var previousPriorityLevel = currentPriorityLevel;

    try {
      if (enableProfiling) {
        try {
          return workLoop(hasTimeRemaining, initialTime);
        } catch (error) {
          if (currentTask !== null) {
            var currentTime = getCurrentTime();
            markTaskErrored(currentTask, currentTime);
            currentTask.isQueued = false;
          }

          throw error;
        }
      } else {
        // No catch in prod codepath.
        return workLoop(hasTimeRemaining, initialTime);
      }
    } finally {
      currentTask = null;
      currentPriorityLevel = previousPriorityLevel;
      isPerformingWork = false;

      if (enableProfiling) {
        var _currentTime = getCurrentTime();

        markSchedulerSuspended(_currentTime);
      }
    }
  }

  function workLoop(hasTimeRemaining, initialTime) {
    var currentTime = initialTime;
    advanceTimers(currentTime);
    currentTask = peek(taskQueue);

    while (currentTask !== null && !(enableSchedulerDebugging && isSchedulerPaused)) {
      if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
        // This currentTask hasn't expired, and we've reached the deadline.
        break;
      }

      var callback = currentTask.callback;

      if (callback !== null) {
        currentTask.callback = null;
        currentPriorityLevel = currentTask.priorityLevel;
        var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
        markTaskRun(currentTask, currentTime);
        var continuationCallback = callback(didUserCallbackTimeout);
        currentTime = getCurrentTime();

        if (typeof continuationCallback === 'function') {
          currentTask.callback = continuationCallback;
          markTaskYield(currentTask, currentTime);
        } else {
          if (enableProfiling) {
            markTaskCompleted(currentTask, currentTime);
            currentTask.isQueued = false;
          }

          if (currentTask === peek(taskQueue)) {
            pop(taskQueue);
          }
        }

        advanceTimers(currentTime);
      } else {
        pop(taskQueue);
      }

      currentTask = peek(taskQueue);
    } // Return whether there's additional work


    if (currentTask !== null) {
      return true;
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }

      return false;
    }
  }

  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
      case LowPriority:
      case IdlePriority:
        break;

      default:
        priorityLevel = NormalPriority;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_next(eventHandler) {
    var priorityLevel;

    switch (currentPriorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
        // Shift down to normal priority
        priorityLevel = NormalPriority;
        break;

      default:
        // Anything lower than normal priority should remain at the current level.
        priorityLevel = currentPriorityLevel;
        break;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_wrapCallback(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function () {
      // This is a fork of runWithPriority, inlined for performance.
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = parentPriorityLevel;

      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
  }

  function timeoutForPriorityLevel(priorityLevel) {
    switch (priorityLevel) {
      case ImmediatePriority:
        return IMMEDIATE_PRIORITY_TIMEOUT;

      case UserBlockingPriority:
        return USER_BLOCKING_PRIORITY;

      case IdlePriority:
        return IDLE_PRIORITY;

      case LowPriority:
        return LOW_PRIORITY_TIMEOUT;

      case NormalPriority:
      default:
        return NORMAL_PRIORITY_TIMEOUT;
    }
  }

  function unstable_scheduleCallback(priorityLevel, callback, options) {
    var currentTime = getCurrentTime();
    var startTime;
    var timeout;

    if (typeof options === 'object' && options !== null) {
      var delay = options.delay;

      if (typeof delay === 'number' && delay > 0) {
        startTime = currentTime + delay;
      } else {
        startTime = currentTime;
      }

      timeout = typeof options.timeout === 'number' ? options.timeout : timeoutForPriorityLevel(priorityLevel);
    } else {
      timeout = timeoutForPriorityLevel(priorityLevel);
      startTime = currentTime;
    }

    var expirationTime = startTime + timeout;
    var newTask = {
      id: taskIdCounter++,
      callback: callback,
      priorityLevel: priorityLevel,
      startTime: startTime,
      expirationTime: expirationTime,
      sortIndex: -1
    };

    if (enableProfiling) {
      newTask.isQueued = false;
    }

    if (startTime > currentTime) {
      // This is a delayed task.
      newTask.sortIndex = startTime;
      push(timerQueue, newTask);

      if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
        // All tasks are delayed, and this is the task with the earliest delay.
        if (isHostTimeoutScheduled) {
          // Cancel an existing timeout.
          cancelHostTimeout();
        } else {
          isHostTimeoutScheduled = true;
        } // Schedule a timeout.


        requestHostTimeout(handleTimeout, startTime - currentTime);
      }
    } else {
      newTask.sortIndex = expirationTime;
      push(taskQueue, newTask);

      if (enableProfiling) {
        markTaskStart(newTask, currentTime);
        newTask.isQueued = true;
      } // Schedule a host callback, if needed. If we're already performing work,
      // wait until the next time we yield.


      if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      }
    }

    return newTask;
  }

  function unstable_pauseExecution() {
    isSchedulerPaused = true;
  }

  function unstable_continueExecution() {
    isSchedulerPaused = false;

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  function unstable_getFirstCallbackNode() {
    return peek(taskQueue);
  }

  function unstable_cancelCallback(task) {
    if (enableProfiling) {
      if (task.isQueued) {
        var currentTime = getCurrentTime();
        markTaskCanceled(task, currentTime);
        task.isQueued = false;
      }
    } // Null out the callback to indicate the task has been canceled. (Can't
    // remove from the queue because you can't remove arbitrary nodes from an
    // array based heap, only the first one.)


    task.callback = null;
  }

  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }

  function unstable_shouldYield() {
    var currentTime = getCurrentTime();
    advanceTimers(currentTime);
    var firstTask = peek(taskQueue);
    return firstTask !== currentTask && currentTask !== null && firstTask !== null && firstTask.callback !== null && firstTask.startTime <= currentTime && firstTask.expirationTime < currentTask.expirationTime || shouldYieldToHost();
  }

  var unstable_requestPaint = requestPaint;
  var unstable_Profiling = enableProfiling ? {
    startLoggingProfilingEvents: startLoggingProfilingEvents,
    stopLoggingProfilingEvents: stopLoggingProfilingEvents,
    sharedProfilingBuffer: sharedProfilingBuffer
  } : null;
  var Scheduler = Object.freeze({
    unstable_ImmediatePriority: ImmediatePriority,
    unstable_UserBlockingPriority: UserBlockingPriority,
    unstable_NormalPriority: NormalPriority,
    unstable_IdlePriority: IdlePriority,
    unstable_LowPriority: LowPriority,
    unstable_runWithPriority: unstable_runWithPriority,
    unstable_next: unstable_next,
    unstable_scheduleCallback: unstable_scheduleCallback,
    unstable_cancelCallback: unstable_cancelCallback,
    unstable_wrapCallback: unstable_wrapCallback,
    unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
    unstable_shouldYield: unstable_shouldYield,
    unstable_requestPaint: unstable_requestPaint,
    unstable_continueExecution: unstable_continueExecution,
    unstable_pauseExecution: unstable_pauseExecution,
    unstable_getFirstCallbackNode: unstable_getFirstCallbackNode,

    get unstable_now() {
      return getCurrentTime;
    },

    get unstable_forceFrameRate() {
      return forceFrameRate;
    },

    unstable_Profiling: unstable_Profiling
  }); // Helps identify side effects in render-phase lifecycle hooks and setState
  // reducers by double invoking them in Strict Mode.
  // To preserve the "Pause on caught exceptions" behavior of the debugger, we
  // replay the begin phase of a failed component inside invokeGuardedCallback.
  // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:
  // Gather advanced timing metrics for Profiler subtrees.
  // Trace which interactions trigger each commit.

  var enableSchedulerTracing = true; // SSR experiments
  // Only used in www builds.
  // Only used in www builds.
  // Disable javascript: URL strings in href for XSS protection.
  // React Fire: prevent the value and checked attributes from syncing
  // with their related DOM properties
  // These APIs will no longer be "unstable" in the upcoming 16.7 release,
  // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.

  var exposeConcurrentModeAPIs = false; // Experimental React Flare event system and event components support.

  var enableFlareAPI = false; // Experimental Host Component support.

  var enableFundamentalAPI = false; // Experimental Scope support.

  var enableScopeAPI = false; // New API for JSX transforms to target - https://github.com/reactjs/rfcs/pull/107

  var enableJSXTransformAPI = false; // We will enforce mocking scheduler with scheduler/unstable_mock at some point. (v17?)
  // Till then, we warn about the missing mock, but still fallback to a legacy mode compatible version
  // For tests, we flush suspense fallbacks in an act scope;
  // *except* in some of our own tests, where we test incremental loading states.
  // Add a callback property to suspense to notify which promises are currently
  // in the update queue. This allows reporting and tracing of what is causing
  // the user to see a loading state.
  // Also allows hydration callbacks to fire when a dehydrated boundary gets
  // hydrated or deleted.
  // Part of the simplification of React.createElement so we can eventually move
  // from React.createElement to React.jsx
  // https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md
  // Flag to turn event.target and event.currentTarget in ReactNative from a reactTag to a component instance

  var DEFAULT_THREAD_ID = 0; // Counters used to generate unique IDs.

  var interactionIDCounter = 0;
  var threadIDCounter = 0; // Set of currently traced interactions.
  // Interactions "stack"–
  // Meaning that newly traced interactions are appended to the previously active set.
  // When an interaction goes out of scope, the previous set (if any) is restored.

  var interactionsRef = null; // Listener(s) to notify when interactions begin and end.

  var subscriberRef = null;

  if (enableSchedulerTracing) {
    interactionsRef = {
      current: new Set()
    };
    subscriberRef = {
      current: null
    };
  }

  function unstable_clear(callback) {
    if (!enableSchedulerTracing) {
      return callback();
    }

    var prevInteractions = interactionsRef.current;
    interactionsRef.current = new Set();

    try {
      return callback();
    } finally {
      interactionsRef.current = prevInteractions;
    }
  }

  function unstable_getCurrent() {
    if (!enableSchedulerTracing) {
      return null;
    } else {
      return interactionsRef.current;
    }
  }

  function unstable_getThreadID() {
    return ++threadIDCounter;
  }

  function unstable_trace(name, timestamp, callback) {
    var threadID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback();
    }

    var interaction = {
      __count: 1,
      id: interactionIDCounter++,
      name: name,
      timestamp: timestamp
    };
    var prevInteractions = interactionsRef.current; // Traced interactions should stack/accumulate.
    // To do that, clone the current interactions.
    // The previous set will be restored upon completion.

    var interactions = new Set(prevInteractions);
    interactions.add(interaction);
    interactionsRef.current = interactions;
    var subscriber = subscriberRef.current;
    var returnValue;

    try {
      if (subscriber !== null) {
        subscriber.onInteractionTraced(interaction);
      }
    } finally {
      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(interactions, threadID);
        }
      } finally {
        try {
          returnValue = callback();
        } finally {
          interactionsRef.current = prevInteractions;

          try {
            if (subscriber !== null) {
              subscriber.onWorkStopped(interactions, threadID);
            }
          } finally {
            interaction.__count--; // If no async work was scheduled for this interaction,
            // Notify subscribers that it's completed.

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          }
        }
      }
    }

    return returnValue;
  }

  function unstable_wrap(callback) {
    var threadID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback;
    }

    var wrappedInteractions = interactionsRef.current;
    var subscriber = subscriberRef.current;

    if (subscriber !== null) {
      subscriber.onWorkScheduled(wrappedInteractions, threadID);
    } // Update the pending async work count for the current interactions.
    // Update after calling subscribers in case of error.


    wrappedInteractions.forEach(function (interaction) {
      interaction.__count++;
    });
    var hasRun = false;

    function wrapped() {
      var prevInteractions = interactionsRef.current;
      interactionsRef.current = wrappedInteractions;
      subscriber = subscriberRef.current;

      try {
        var returnValue;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStarted(wrappedInteractions, threadID);
          }
        } finally {
          try {
            returnValue = callback.apply(undefined, arguments);
          } finally {
            interactionsRef.current = prevInteractions;

            if (subscriber !== null) {
              subscriber.onWorkStopped(wrappedInteractions, threadID);
            }
          }
        }

        return returnValue;
      } finally {
        if (!hasRun) {
          // We only expect a wrapped function to be executed once,
          // But in the event that it's executed more than once–
          // Only decrement the outstanding interaction counts once.
          hasRun = true; // Update pending async counts for all wrapped interactions.
          // If this was the last scheduled async work for any of them,
          // Mark them as completed.

          wrappedInteractions.forEach(function (interaction) {
            interaction.__count--;

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      }
    }

    wrapped.cancel = function cancel() {
      subscriber = subscriberRef.current;

      try {
        if (subscriber !== null) {
          subscriber.onWorkCanceled(wrappedInteractions, threadID);
        }
      } finally {
        // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.
        wrappedInteractions.forEach(function (interaction) {
          interaction.__count--;

          if (subscriber && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    };

    return wrapped;
  }

  var subscribers = null;

  if (enableSchedulerTracing) {
    subscribers = new Set();
  }

  function unstable_subscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.add(subscriber);

      if (subscribers.size === 1) {
        subscriberRef.current = {
          onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
          onInteractionTraced: onInteractionTraced,
          onWorkCanceled: onWorkCanceled,
          onWorkScheduled: onWorkScheduled,
          onWorkStarted: onWorkStarted,
          onWorkStopped: onWorkStopped
        };
      }
    }
  }

  function unstable_unsubscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        subscriberRef.current = null;
      }
    }
  }

  function onInteractionTraced(interaction) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionTraced(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onInteractionScheduledWorkCompleted(interaction) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionScheduledWorkCompleted(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkScheduled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkScheduled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStarted(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStopped(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStopped(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkCanceled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkCanceled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  var SchedulerTracing = Object.freeze({
    get __interactionsRef() {
      return interactionsRef;
    },

    get __subscriberRef() {
      return subscriberRef;
    },

    unstable_clear: unstable_clear,
    unstable_getCurrent: unstable_getCurrent,
    unstable_getThreadID: unstable_getThreadID,
    unstable_trace: unstable_trace,
    unstable_wrap: unstable_wrap,
    unstable_subscribe: unstable_subscribe,
    unstable_unsubscribe: unstable_unsubscribe
  });
  var ReactSharedInternals$2 = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    IsSomeRendererActing: IsSomeRendererActing,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign
  };
  {
    objectAssign(ReactSharedInternals$2, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  } // Re-export the schedule API(s) for UMD bundles.
  // This avoids introducing a dependency on a new UMD global in a minor update,
  // Since that would be a breaking change (e.g. for all existing CodeSandboxes).
  // This re-export is only required for UMD bundles;
  // CJS bundles use the shared NPM package.

  objectAssign(ReactSharedInternals$2, {
    Scheduler: Scheduler,
    SchedulerTracing: SchedulerTracing
  });
  var hasBadMapPolyfill;
  {
    hasBadMapPolyfill = false;

    try {
      var frozenObject = Object.freeze({});
      var testMap = new Map([[frozenObject, null]]);
      var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
      // https://github.com/rollup/rollup/issues/1771
      // TODO: we can remove these if Rollup fixes the bug.

      testMap.set(0, 0);
      testSet.add(0);
    } catch (e) {
      // TODO: Consider warning about bad polyfills
      hasBadMapPolyfill = true;
    }
  }

  function createFundamentalComponent(impl) {
    // We use responder as a Map key later on. When we have a bad
    // polyfill, then we can't use it as a key as the polyfill tries
    // to add a property to the object.
    if (true && !hasBadMapPolyfill) {
      Object.freeze(impl);
    }

    var fundamantalComponent = {
      $$typeof: REACT_FUNDAMENTAL_TYPE,
      impl: impl
    };
    {
      Object.freeze(fundamantalComponent);
    }
    return fundamantalComponent;
  }

  function createEventResponder(displayName, responderConfig) {
    var getInitialState = responderConfig.getInitialState,
        onEvent = responderConfig.onEvent,
        onMount = responderConfig.onMount,
        onUnmount = responderConfig.onUnmount,
        onRootEvent = responderConfig.onRootEvent,
        rootEventTypes = responderConfig.rootEventTypes,
        targetEventTypes = responderConfig.targetEventTypes,
        targetPortalPropagation = responderConfig.targetPortalPropagation;
    var eventResponder = {
      $$typeof: REACT_RESPONDER_TYPE,
      displayName: displayName,
      getInitialState: getInitialState || null,
      onEvent: onEvent || null,
      onMount: onMount || null,
      onRootEvent: onRootEvent || null,
      onUnmount: onUnmount || null,
      rootEventTypes: rootEventTypes || null,
      targetEventTypes: targetEventTypes || null,
      targetPortalPropagation: targetPortalPropagation || false
    }; // We use responder as a Map key later on. When we have a bad
    // polyfill, then we can't use it as a key as the polyfill tries
    // to add a property to the object.

    if (true && !hasBadMapPolyfill) {
      Object.freeze(eventResponder);
    }

    return eventResponder;
  }

  function createScope() {
    var scopeComponent = {
      $$typeof: REACT_SCOPE_TYPE
    };
    {
      Object.freeze(scopeComponent);
    }
    return scopeComponent;
  }

  var React = {
    Children: {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray: toArray,
      only: onlyChild
    },
    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent,
    createContext: createContext,
    forwardRef: forwardRef,
    lazy: lazy,
    memo: memo,
    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,
    Fragment: REACT_FRAGMENT_TYPE,
    Profiler: REACT_PROFILER_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,
    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement,
    version: ReactVersion,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals$2
  };

  if (exposeConcurrentModeAPIs) {
    React.useTransition = useTransition;
    React.useDeferredValue = useDeferredValue;
    React.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
    React.unstable_withSuspenseConfig = withSuspenseConfig;
  }

  if (enableFlareAPI) {
    React.unstable_useResponder = useResponder;
    React.unstable_createResponder = createEventResponder;
  }

  if (enableFundamentalAPI) {
    React.unstable_createFundamental = createFundamentalComponent;
  }

  if (enableScopeAPI) {
    React.unstable_createScope = createScope;
  } // Note: some APIs are added with feature flags.
  // Make sure that stable builds for open source
  // don't modify the React object to avoid deopts.
  // Also let's not expose their names in stable builds.


  if (enableJSXTransformAPI) {
    {
      React.jsxDEV = jsxWithValidation;
      React.jsx = jsxWithValidationDynamic;
      React.jsxs = jsxWithValidationStatic;
    }
  }

  var React$2 = Object.freeze({
    default: React
  });
  var React$3 = React$2 && React || React$2; // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.

  var react = React$3.default || React$3;
  return react;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NsaWVudC9yZWFjdC5kZXZlbG9wbWVudC5qcyJdLCJuYW1lcyI6WyJnbG9iYWwiLCJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmluZSIsImFtZCIsIlJlYWN0IiwiUmVhY3RWZXJzaW9uIiwiaGFzU3ltYm9sIiwiU3ltYm9sIiwiZm9yIiwiUkVBQ1RfRUxFTUVOVF9UWVBFIiwiUkVBQ1RfUE9SVEFMX1RZUEUiLCJSRUFDVF9GUkFHTUVOVF9UWVBFIiwiUkVBQ1RfU1RSSUNUX01PREVfVFlQRSIsIlJFQUNUX1BST0ZJTEVSX1RZUEUiLCJSRUFDVF9QUk9WSURFUl9UWVBFIiwiUkVBQ1RfQ09OVEVYVF9UWVBFIiwiUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUiLCJSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIiwiUkVBQ1RfU1VTUEVOU0VfVFlQRSIsIlJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSIsIlJFQUNUX01FTU9fVFlQRSIsIlJFQUNUX0xBWllfVFlQRSIsIlJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUiLCJSRUFDVF9SRVNQT05ERVJfVFlQRSIsIlJFQUNUX1NDT1BFX1RZUEUiLCJNQVlCRV9JVEVSQVRPUl9TWU1CT0wiLCJpdGVyYXRvciIsIkZBVVhfSVRFUkFUT1JfU1lNQk9MIiwiZ2V0SXRlcmF0b3JGbiIsIm1heWJlSXRlcmFibGUiLCJtYXliZUl0ZXJhdG9yIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwiT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJwcm90b3R5cGUiLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInZhbCIsInVuZGVmaW5lZCIsIlR5cGVFcnJvciIsInNob3VsZFVzZU5hdGl2ZSIsImFzc2lnbiIsInRlc3QxIiwiU3RyaW5nIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInRlc3QyIiwiaSIsImZyb21DaGFyQ29kZSIsIm9yZGVyMiIsIm1hcCIsIm4iLCJqb2luIiwidGVzdDMiLCJzcGxpdCIsImZvckVhY2giLCJsZXR0ZXIiLCJrZXlzIiwiZXJyIiwib2JqZWN0QXNzaWduIiwidGFyZ2V0Iiwic291cmNlIiwiZnJvbSIsInRvIiwic3ltYm9scyIsInMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJrZXkiLCJjYWxsIiwibG93UHJpb3JpdHlXYXJuaW5nV2l0aG91dFN0YWNrIiwicHJpbnRXYXJuaW5nIiwiZm9ybWF0IiwiX2xlbiIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJhcmdJbmRleCIsIm1lc3NhZ2UiLCJyZXBsYWNlIiwiY29uc29sZSIsIndhcm4iLCJFcnJvciIsIngiLCJjb25kaXRpb24iLCJfbGVuMiIsIl9rZXkyIiwiYXBwbHkiLCJjb25jYXQiLCJsb3dQcmlvcml0eVdhcm5pbmdXaXRob3V0U3RhY2skMSIsIndhcm5pbmdXaXRob3V0U3RhY2siLCJhcmdzV2l0aEZvcm1hdCIsIml0ZW0iLCJ1bnNoaWZ0IiwiRnVuY3Rpb24iLCJlcnJvciIsIndhcm5pbmdXaXRob3V0U3RhY2skMSIsImRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCIsIndhcm5Ob29wIiwicHVibGljSW5zdGFuY2UiLCJjYWxsZXJOYW1lIiwiX2NvbnN0cnVjdG9yIiwiY29uc3RydWN0b3IiLCJjb21wb25lbnROYW1lIiwiZGlzcGxheU5hbWUiLCJuYW1lIiwid2FybmluZ0tleSIsIlJlYWN0Tm9vcFVwZGF0ZVF1ZXVlIiwiaXNNb3VudGVkIiwiZW5xdWV1ZUZvcmNlVXBkYXRlIiwiY2FsbGJhY2siLCJlbnF1ZXVlUmVwbGFjZVN0YXRlIiwiY29tcGxldGVTdGF0ZSIsImVucXVldWVTZXRTdGF0ZSIsInBhcnRpYWxTdGF0ZSIsImVtcHR5T2JqZWN0IiwiZnJlZXplIiwiQ29tcG9uZW50IiwicHJvcHMiLCJjb250ZXh0IiwidXBkYXRlciIsInJlZnMiLCJpc1JlYWN0Q29tcG9uZW50Iiwic2V0U3RhdGUiLCJmb3JjZVVwZGF0ZSIsImRlcHJlY2F0ZWRBUElzIiwicmVwbGFjZVN0YXRlIiwiZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nIiwibWV0aG9kTmFtZSIsImluZm8iLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImZuTmFtZSIsIkNvbXBvbmVudER1bW15IiwiUHVyZUNvbXBvbmVudCIsInB1cmVDb21wb25lbnRQcm90b3R5cGUiLCJpc1B1cmVSZWFjdENvbXBvbmVudCIsImNyZWF0ZVJlZiIsInJlZk9iamVjdCIsImN1cnJlbnQiLCJzZWFsIiwiUmVhY3RDdXJyZW50RGlzcGF0Y2hlciIsIlJlYWN0Q3VycmVudEJhdGNoQ29uZmlnIiwic3VzcGVuc2UiLCJSZWFjdEN1cnJlbnRPd25lciIsIkJFRk9SRV9TTEFTSF9SRSIsImRlc2NyaWJlQ29tcG9uZW50RnJhbWUiLCJvd25lck5hbWUiLCJzb3VyY2VJbmZvIiwicGF0aCIsImZpbGVOYW1lIiwidGVzdCIsIm1hdGNoIiwicGF0aEJlZm9yZVNsYXNoIiwiZm9sZGVyTmFtZSIsImxpbmVOdW1iZXIiLCJSZXNvbHZlZCIsInJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudCIsImxhenlDb21wb25lbnQiLCJfc3RhdHVzIiwiX3Jlc3VsdCIsImdldFdyYXBwZWROYW1lIiwib3V0ZXJUeXBlIiwiaW5uZXJUeXBlIiwid3JhcHBlck5hbWUiLCJmdW5jdGlvbk5hbWUiLCJnZXRDb21wb25lbnROYW1lIiwidHlwZSIsInRhZyIsIiQkdHlwZW9mIiwicmVuZGVyIiwidGhlbmFibGUiLCJyZXNvbHZlZFRoZW5hYmxlIiwiUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSIsImN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Iiwic2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQiLCJlbGVtZW50IiwiZ2V0Q3VycmVudFN0YWNrIiwiZ2V0U3RhY2tBZGRlbmR1bSIsInN0YWNrIiwib3duZXIiLCJfb3duZXIiLCJfc291cmNlIiwiaW1wbCIsIklzU29tZVJlbmRlcmVyQWN0aW5nIiwiUmVhY3RTaGFyZWRJbnRlcm5hbHMiLCJSZWFjdENvbXBvbmVudFRyZWVIb29rIiwid2FybmluZyIsIndhcm5pbmckMSIsImhhc093blByb3BlcnR5JDEiLCJSRVNFUlZFRF9QUk9QUyIsInJlZiIsIl9fc2VsZiIsIl9fc291cmNlIiwic3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24iLCJzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biIsImhhc1ZhbGlkUmVmIiwiY29uZmlnIiwiZ2V0dGVyIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiaXNSZWFjdFdhcm5pbmciLCJoYXNWYWxpZEtleSIsImRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyIiwid2FybkFib3V0QWNjZXNzaW5nS2V5IiwiY29uZmlndXJhYmxlIiwiZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIiLCJ3YXJuQWJvdXRBY2Nlc3NpbmdSZWYiLCJSZWFjdEVsZW1lbnQiLCJzZWxmIiwiX3N0b3JlIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwidmFsdWUiLCJqc3hERVYiLCJtYXliZUtleSIsInByb3BOYW1lIiwiZGVmYXVsdFByb3BzIiwiY3JlYXRlRWxlbWVudCIsImNoaWxkcmVuIiwiY2hpbGRyZW5MZW5ndGgiLCJjaGlsZEFycmF5IiwiY2xvbmVBbmRSZXBsYWNlS2V5Iiwib2xkRWxlbWVudCIsIm5ld0tleSIsIm5ld0VsZW1lbnQiLCJfc2VsZiIsImNsb25lRWxlbWVudCIsImlzVmFsaWRFbGVtZW50Iiwib2JqZWN0IiwiU0VQQVJBVE9SIiwiU1VCU0VQQVJBVE9SIiwiZXNjYXBlIiwiZXNjYXBlUmVnZXgiLCJlc2NhcGVyTG9va3VwIiwiZXNjYXBlZFN0cmluZyIsImRpZFdhcm5BYm91dE1hcHMiLCJ1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCIsImVzY2FwZVVzZXJQcm92aWRlZEtleSIsInRleHQiLCJQT09MX1NJWkUiLCJ0cmF2ZXJzZUNvbnRleHRQb29sIiwiZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0IiwibWFwUmVzdWx0Iiwia2V5UHJlZml4IiwibWFwRnVuY3Rpb24iLCJtYXBDb250ZXh0IiwidHJhdmVyc2VDb250ZXh0IiwicG9wIiwicmVzdWx0IiwiZnVuYyIsImNvdW50IiwicmVsZWFzZVRyYXZlcnNlQ29udGV4dCIsInB1c2giLCJ0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbCIsIm5hbWVTb0ZhciIsImludm9rZUNhbGxiYWNrIiwiZ2V0Q29tcG9uZW50S2V5IiwiY2hpbGQiLCJuZXh0TmFtZSIsInN1YnRyZWVDb3VudCIsIm5leHROYW1lUHJlZml4IiwiaXNBcnJheSIsIml0ZXJhdG9yRm4iLCJlbnRyaWVzIiwic3RlcCIsImlpIiwibmV4dCIsImRvbmUiLCJhZGRlbmR1bSIsImNoaWxkcmVuU3RyaW5nIiwidHJhdmVyc2VBbGxDaGlsZHJlbiIsImNvbXBvbmVudCIsImluZGV4IiwidG9TdHJpbmciLCJmb3JFYWNoU2luZ2xlQ2hpbGQiLCJib29rS2VlcGluZyIsImZvckVhY2hDaGlsZHJlbiIsImZvckVhY2hGdW5jIiwiZm9yRWFjaENvbnRleHQiLCJtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0IiwiY2hpbGRLZXkiLCJtYXBwZWRDaGlsZCIsIm1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwiLCJjIiwiYXJyYXkiLCJwcmVmaXgiLCJlc2NhcGVkUHJlZml4IiwibWFwQ2hpbGRyZW4iLCJjb3VudENoaWxkcmVuIiwidG9BcnJheSIsIm9ubHlDaGlsZCIsImNyZWF0ZUNvbnRleHQiLCJkZWZhdWx0VmFsdWUiLCJjYWxjdWxhdGVDaGFuZ2VkQml0cyIsIl9jYWxjdWxhdGVDaGFuZ2VkQml0cyIsIl9jdXJyZW50VmFsdWUiLCJfY3VycmVudFZhbHVlMiIsIl90aHJlYWRDb3VudCIsIlByb3ZpZGVyIiwiQ29uc3VtZXIiLCJfY29udGV4dCIsImhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzIiwiaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwic2V0IiwiX1Byb3ZpZGVyIiwiX2N1cnJlbnRSZW5kZXJlciIsIl9jdXJyZW50UmVuZGVyZXIyIiwibGF6eSIsImN0b3IiLCJsYXp5VHlwZSIsIl9jdG9yIiwicHJvcFR5cGVzIiwibmV3RGVmYXVsdFByb3BzIiwibmV3UHJvcFR5cGVzIiwiZm9yd2FyZFJlZiIsImlzVmFsaWRFbGVtZW50VHlwZSIsIm1lbW8iLCJjb21wYXJlIiwicmVzb2x2ZURpc3BhdGNoZXIiLCJkaXNwYXRjaGVyIiwidXNlQ29udGV4dCIsIkNvbnRleHQiLCJ1bnN0YWJsZV9vYnNlcnZlZEJpdHMiLCJyZWFsQ29udGV4dCIsInVzZVN0YXRlIiwiaW5pdGlhbFN0YXRlIiwidXNlUmVkdWNlciIsInJlZHVjZXIiLCJpbml0aWFsQXJnIiwiaW5pdCIsInVzZVJlZiIsImluaXRpYWxWYWx1ZSIsInVzZUVmZmVjdCIsImNyZWF0ZSIsImlucHV0cyIsInVzZUxheW91dEVmZmVjdCIsInVzZUNhbGxiYWNrIiwidXNlTWVtbyIsInVzZUltcGVyYXRpdmVIYW5kbGUiLCJ1c2VEZWJ1Z1ZhbHVlIiwiZm9ybWF0dGVyRm4iLCJlbXB0eU9iamVjdCQxIiwidXNlUmVzcG9uZGVyIiwicmVzcG9uZGVyIiwibGlzdGVuZXJQcm9wcyIsInVzZVRyYW5zaXRpb24iLCJ1c2VEZWZlcnJlZFZhbHVlIiwid2l0aFN1c3BlbnNlQ29uZmlnIiwic2NvcGUiLCJwcmV2aW91c0NvbmZpZyIsIlJlYWN0UHJvcFR5cGVzU2VjcmV0JDEiLCJSZWFjdFByb3BUeXBlc1NlY3JldF8xIiwicHJpbnRXYXJuaW5nJDEiLCJSZWFjdFByb3BUeXBlc1NlY3JldCIsImxvZ2dlZFR5cGVGYWlsdXJlcyIsImhhcyIsImJpbmQiLCJjaGVja1Byb3BUeXBlcyIsInR5cGVTcGVjcyIsInZhbHVlcyIsImxvY2F0aW9uIiwiZ2V0U3RhY2siLCJ0eXBlU3BlY05hbWUiLCJleCIsInJlc2V0V2FybmluZ0NhY2hlIiwiY2hlY2tQcm9wVHlwZXNfMSIsInByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duIiwiaGFzT3duUHJvcGVydHkkMiIsImdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSIsImdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtIiwiZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW1Gb3JQcm9wcyIsImVsZW1lbnRQcm9wcyIsIm93bmVySGFzS2V5VXNlV2FybmluZyIsImdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8iLCJwYXJlbnRUeXBlIiwicGFyZW50TmFtZSIsInZhbGlkYXRlRXhwbGljaXRLZXkiLCJ2YWxpZGF0ZWQiLCJjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvIiwiY2hpbGRPd25lciIsInZhbGlkYXRlQ2hpbGRLZXlzIiwibm9kZSIsInZhbGlkYXRlUHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZ2V0RGVmYXVsdFByb3BzIiwiaXNSZWFjdENsYXNzQXBwcm92ZWQiLCJ2YWxpZGF0ZUZyYWdtZW50UHJvcHMiLCJmcmFnbWVudCIsImpzeFdpdGhWYWxpZGF0aW9uIiwiaXNTdGF0aWNDaGlsZHJlbiIsInZhbGlkVHlwZSIsInR5cGVTdHJpbmciLCJqc3hXaXRoVmFsaWRhdGlvblN0YXRpYyIsImpzeFdpdGhWYWxpZGF0aW9uRHluYW1pYyIsImNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiIsImNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbiIsInZhbGlkYXRlZEZhY3RvcnkiLCJjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiIsImVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyIsImVuYWJsZUlzSW5wdXRQZW5kaW5nIiwiZW5hYmxlUHJvZmlsaW5nIiwicmVxdWVzdEhvc3RDYWxsYmFjayIsInJlcXVlc3RIb3N0VGltZW91dCIsImNhbmNlbEhvc3RUaW1lb3V0Iiwic2hvdWxkWWllbGRUb0hvc3QiLCJyZXF1ZXN0UGFpbnQiLCJnZXRDdXJyZW50VGltZSIsImZvcmNlRnJhbWVSYXRlIiwid2luZG93IiwiTWVzc2FnZUNoYW5uZWwiLCJfY2FsbGJhY2siLCJfdGltZW91dElEIiwiX2ZsdXNoQ2FsbGJhY2siLCJjdXJyZW50VGltZSIsImhhc1JlbWFpbmluZ1RpbWUiLCJlIiwic2V0VGltZW91dCIsImluaXRpYWxUaW1lIiwiRGF0ZSIsIm5vdyIsImNiIiwibXMiLCJjbGVhclRpbWVvdXQiLCJwZXJmb3JtYW5jZSIsIl9EYXRlIiwiX3NldFRpbWVvdXQiLCJfY2xlYXJUaW1lb3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJfaW5pdGlhbFRpbWUiLCJpc01lc3NhZ2VMb29wUnVubmluZyIsInNjaGVkdWxlZEhvc3RDYWxsYmFjayIsInRhc2tUaW1lb3V0SUQiLCJ5aWVsZEludGVydmFsIiwiZGVhZGxpbmUiLCJtYXhZaWVsZEludGVydmFsIiwibmVlZHNQYWludCIsIm5hdmlnYXRvciIsInNjaGVkdWxpbmciLCJpc0lucHV0UGVuZGluZyIsImZwcyIsIk1hdGgiLCJmbG9vciIsInBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZSIsImhhc1RpbWVSZW1haW5pbmciLCJoYXNNb3JlV29yayIsInBvcnQiLCJwb3N0TWVzc2FnZSIsImNoYW5uZWwiLCJwb3J0MiIsInBvcnQxIiwib25tZXNzYWdlIiwiaGVhcCIsInNpZnRVcCIsInBlZWsiLCJmaXJzdCIsImxhc3QiLCJzaWZ0RG93biIsInBhcmVudEluZGV4IiwicGFyZW50IiwibGVmdEluZGV4IiwibGVmdCIsInJpZ2h0SW5kZXgiLCJyaWdodCIsImEiLCJiIiwiZGlmZiIsInNvcnRJbmRleCIsImlkIiwiTm9Qcmlvcml0eSIsIkltbWVkaWF0ZVByaW9yaXR5IiwiVXNlckJsb2NraW5nUHJpb3JpdHkiLCJOb3JtYWxQcmlvcml0eSIsIkxvd1ByaW9yaXR5IiwiSWRsZVByaW9yaXR5IiwicnVuSWRDb3VudGVyIiwibWFpblRocmVhZElkQ291bnRlciIsInByb2ZpbGluZ1N0YXRlU2l6ZSIsInNoYXJlZFByb2ZpbGluZ0J1ZmZlciIsIlNoYXJlZEFycmF5QnVmZmVyIiwiSW50MzJBcnJheSIsIkJZVEVTX1BFUl9FTEVNRU5UIiwiQXJyYXlCdWZmZXIiLCJwcm9maWxpbmdTdGF0ZSIsIlBSSU9SSVRZIiwiQ1VSUkVOVF9UQVNLX0lEIiwiQ1VSUkVOVF9SVU5fSUQiLCJRVUVVRV9TSVpFIiwiSU5JVElBTF9FVkVOVF9MT0dfU0laRSIsIk1BWF9FVkVOVF9MT0dfU0laRSIsImV2ZW50TG9nU2l6ZSIsImV2ZW50TG9nQnVmZmVyIiwiZXZlbnRMb2ciLCJldmVudExvZ0luZGV4IiwiVGFza1N0YXJ0RXZlbnQiLCJUYXNrQ29tcGxldGVFdmVudCIsIlRhc2tFcnJvckV2ZW50IiwiVGFza0NhbmNlbEV2ZW50IiwiVGFza1J1bkV2ZW50IiwiVGFza1lpZWxkRXZlbnQiLCJTY2hlZHVsZXJTdXNwZW5kRXZlbnQiLCJTY2hlZHVsZXJSZXN1bWVFdmVudCIsImxvZ0V2ZW50Iiwib2Zmc2V0Iiwic3RvcExvZ2dpbmdQcm9maWxpbmdFdmVudHMiLCJuZXdFdmVudExvZyIsImJ1ZmZlciIsInN0YXJ0TG9nZ2luZ1Byb2ZpbGluZ0V2ZW50cyIsIm1hcmtUYXNrU3RhcnQiLCJ0YXNrIiwicHJpb3JpdHlMZXZlbCIsIm1hcmtUYXNrQ29tcGxldGVkIiwibWFya1Rhc2tDYW5jZWxlZCIsIm1hcmtUYXNrRXJyb3JlZCIsIm1hcmtUYXNrUnVuIiwibWFya1Rhc2tZaWVsZCIsIm1hcmtTY2hlZHVsZXJTdXNwZW5kZWQiLCJtYXJrU2NoZWR1bGVyVW5zdXNwZW5kZWQiLCJtYXhTaWduZWQzMUJpdEludCIsIklNTUVESUFURV9QUklPUklUWV9USU1FT1VUIiwiVVNFUl9CTE9DS0lOR19QUklPUklUWSIsIk5PUk1BTF9QUklPUklUWV9USU1FT1VUIiwiTE9XX1BSSU9SSVRZX1RJTUVPVVQiLCJJRExFX1BSSU9SSVRZIiwidGFza1F1ZXVlIiwidGltZXJRdWV1ZSIsInRhc2tJZENvdW50ZXIiLCJpc1NjaGVkdWxlclBhdXNlZCIsImN1cnJlbnRUYXNrIiwiY3VycmVudFByaW9yaXR5TGV2ZWwiLCJpc1BlcmZvcm1pbmdXb3JrIiwiaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQiLCJpc0hvc3RUaW1lb3V0U2NoZWR1bGVkIiwiYWR2YW5jZVRpbWVycyIsInRpbWVyIiwic3RhcnRUaW1lIiwiZXhwaXJhdGlvblRpbWUiLCJpc1F1ZXVlZCIsImhhbmRsZVRpbWVvdXQiLCJmbHVzaFdvcmsiLCJmaXJzdFRpbWVyIiwicHJldmlvdXNQcmlvcml0eUxldmVsIiwid29ya0xvb3AiLCJfY3VycmVudFRpbWUiLCJkaWRVc2VyQ2FsbGJhY2tUaW1lb3V0IiwiY29udGludWF0aW9uQ2FsbGJhY2siLCJ1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHkiLCJldmVudEhhbmRsZXIiLCJ1bnN0YWJsZV9uZXh0IiwidW5zdGFibGVfd3JhcENhbGxiYWNrIiwicGFyZW50UHJpb3JpdHlMZXZlbCIsInRpbWVvdXRGb3JQcmlvcml0eUxldmVsIiwidW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayIsIm9wdGlvbnMiLCJ0aW1lb3V0IiwiZGVsYXkiLCJuZXdUYXNrIiwidW5zdGFibGVfcGF1c2VFeGVjdXRpb24iLCJ1bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbiIsInVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlIiwidW5zdGFibGVfY2FuY2VsQ2FsbGJhY2siLCJ1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCIsInVuc3RhYmxlX3Nob3VsZFlpZWxkIiwiZmlyc3RUYXNrIiwidW5zdGFibGVfcmVxdWVzdFBhaW50IiwidW5zdGFibGVfUHJvZmlsaW5nIiwiU2NoZWR1bGVyIiwidW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHkiLCJ1bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSIsInVuc3RhYmxlX05vcm1hbFByaW9yaXR5IiwidW5zdGFibGVfSWRsZVByaW9yaXR5IiwidW5zdGFibGVfTG93UHJpb3JpdHkiLCJ1bnN0YWJsZV9ub3ciLCJ1bnN0YWJsZV9mb3JjZUZyYW1lUmF0ZSIsImVuYWJsZVNjaGVkdWxlclRyYWNpbmciLCJleHBvc2VDb25jdXJyZW50TW9kZUFQSXMiLCJlbmFibGVGbGFyZUFQSSIsImVuYWJsZUZ1bmRhbWVudGFsQVBJIiwiZW5hYmxlU2NvcGVBUEkiLCJlbmFibGVKU1hUcmFuc2Zvcm1BUEkiLCJERUZBVUxUX1RIUkVBRF9JRCIsImludGVyYWN0aW9uSURDb3VudGVyIiwidGhyZWFkSURDb3VudGVyIiwiaW50ZXJhY3Rpb25zUmVmIiwic3Vic2NyaWJlclJlZiIsIlNldCIsInVuc3RhYmxlX2NsZWFyIiwicHJldkludGVyYWN0aW9ucyIsInVuc3RhYmxlX2dldEN1cnJlbnQiLCJ1bnN0YWJsZV9nZXRUaHJlYWRJRCIsInVuc3RhYmxlX3RyYWNlIiwidGltZXN0YW1wIiwidGhyZWFkSUQiLCJpbnRlcmFjdGlvbiIsIl9fY291bnQiLCJpbnRlcmFjdGlvbnMiLCJhZGQiLCJzdWJzY3JpYmVyIiwicmV0dXJuVmFsdWUiLCJvbkludGVyYWN0aW9uVHJhY2VkIiwib25Xb3JrU3RhcnRlZCIsIm9uV29ya1N0b3BwZWQiLCJvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZCIsInVuc3RhYmxlX3dyYXAiLCJ3cmFwcGVkSW50ZXJhY3Rpb25zIiwib25Xb3JrU2NoZWR1bGVkIiwiaGFzUnVuIiwid3JhcHBlZCIsImNhbmNlbCIsIm9uV29ya0NhbmNlbGVkIiwic3Vic2NyaWJlcnMiLCJ1bnN0YWJsZV9zdWJzY3JpYmUiLCJzaXplIiwidW5zdGFibGVfdW5zdWJzY3JpYmUiLCJkZWxldGUiLCJkaWRDYXRjaEVycm9yIiwiY2F1Z2h0RXJyb3IiLCJTY2hlZHVsZXJUcmFjaW5nIiwiX19pbnRlcmFjdGlvbnNSZWYiLCJfX3N1YnNjcmliZXJSZWYiLCJSZWFjdFNoYXJlZEludGVybmFscyQyIiwiaGFzQmFkTWFwUG9seWZpbGwiLCJmcm96ZW5PYmplY3QiLCJ0ZXN0TWFwIiwiTWFwIiwidGVzdFNldCIsImNyZWF0ZUZ1bmRhbWVudGFsQ29tcG9uZW50IiwiZnVuZGFtYW50YWxDb21wb25lbnQiLCJjcmVhdGVFdmVudFJlc3BvbmRlciIsInJlc3BvbmRlckNvbmZpZyIsImdldEluaXRpYWxTdGF0ZSIsIm9uRXZlbnQiLCJvbk1vdW50Iiwib25Vbm1vdW50Iiwib25Sb290RXZlbnQiLCJyb290RXZlbnRUeXBlcyIsInRhcmdldEV2ZW50VHlwZXMiLCJ0YXJnZXRQb3J0YWxQcm9wYWdhdGlvbiIsImV2ZW50UmVzcG9uZGVyIiwiY3JlYXRlU2NvcGUiLCJzY29wZUNvbXBvbmVudCIsIkNoaWxkcmVuIiwib25seSIsIkZyYWdtZW50IiwiUHJvZmlsZXIiLCJTdHJpY3RNb2RlIiwiU3VzcGVuc2UiLCJjcmVhdGVGYWN0b3J5IiwidmVyc2lvbiIsIl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEIiwiU3VzcGVuc2VMaXN0IiwidW5zdGFibGVfd2l0aFN1c3BlbnNlQ29uZmlnIiwidW5zdGFibGVfdXNlUmVzcG9uZGVyIiwidW5zdGFibGVfY3JlYXRlUmVzcG9uZGVyIiwidW5zdGFibGVfY3JlYXRlRnVuZGFtZW50YWwiLCJ1bnN0YWJsZV9jcmVhdGVTY29wZSIsImpzeCIsImpzeHMiLCJSZWFjdCQyIiwiZGVmYXVsdCIsIlJlYWN0JDMiLCJyZWFjdCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBU0E7O0FBRUMsV0FBVUEsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7QUFDM0IsU0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQyxNQUFQLEtBQWtCLFdBQWpELEdBQStEQSxNQUFNLENBQUNELE9BQVAsR0FBaUJELE9BQU8sRUFBdkYsR0FDQSxPQUFPRyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxNQUFNLENBQUNDLEdBQXZDLEdBQTZDRCxNQUFNLENBQUNILE9BQUQsQ0FBbkQsR0FDQ0QsTUFBTSxDQUFDTSxLQUFQLEdBQWVMLE9BQU8sRUFGdkI7QUFHQSxDQUpBLEVBSUMsSUFKRCxFQUlRLFlBQVk7QUFBRSxlQUFGLENBRXJCOztBQUVBLE1BQUlNLFlBQVksR0FBRyxTQUFuQixDQUpxQixDQU1yQjtBQUNBOztB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QUFLLENBQUM4b0IsSUFBTixHQUFhelEsdUJBQWI7QUFDRDtBQUNGOztBQUlELE1BQUkwUSxPQUFPLEdBQUdubkIsTUFBTSxDQUFDb0YsTUFBUCxDQUFjO0FBQzNCZ2lCLElBQUFBLE9BQU8sRUFBRWhwQjtBQURrQixHQUFkLENBQWQ7QUFJQSxNQUFJaXBCLE9BQU8sR0FBS0YsT0FBTyxJQUFJL29CLEtBQWIsSUFBd0Irb0IsT0FBdEMsQ0F2ckhxQixDQXlySHJCO0FBQ0E7O0FBR0EsTUFBSUcsS0FBSyxHQUFHRCxPQUFPLENBQUNELE9BQVIsSUFBbUJDLE9BQS9CO0FBRUEsU0FBT0MsS0FBUDtBQUVDLENBcnNIQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi4xMi4wXG4gKiByZWFjdC5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLlJlYWN0ID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBUT0RPOiB0aGlzIGlzIHNwZWNpYWwgYmVjYXVzZSBpdCBnZXRzIGltcG9ydGVkIGR1cmluZyBidWlsZC5cblxudmFyIFJlYWN0VmVyc2lvbiA9ICcxNi4xMi4wJztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlOyAvLyBUT0RPOiBXZSBkb24ndCB1c2UgQXN5bmNNb2RlIG9yIENvbmN1cnJlbnRNb2RlIGFueW1vcmUuIFRoZXkgd2VyZSB0ZW1wb3Jhcnlcbi8vICh1bnN0YWJsZSkgQVBJcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkLiBDYW4gd2UgcmVtb3ZlIHRoZSBzeW1ib2xzP1xuXG5cbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKSA6IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xudmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpIDogMHhlYWQ1O1xudmFyIFJFQUNUX1JFU1BPTkRFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucmVzcG9uZGVyJykgOiAweGVhZDY7XG52YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnNjb3BlJykgOiAweGVhZDc7XG52YXIgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgaWYgKG1heWJlSXRlcmFibGUgPT09IG51bGwgfHwgdHlwZW9mIG1heWJlSXRlcmFibGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgbWF5YmVJdGVyYXRvciA9IE1BWUJFX0lURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW01BWUJFX0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF07XG5cbiAgaWYgKHR5cGVvZiBtYXliZUl0ZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3I7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxudmFyIG9iamVjdEFzc2lnbiA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG5cbi8vIERvIG5vdCByZXF1aXJlIHRoaXMgbW9kdWxlIGRpcmVjdGx5ISBVc2Ugbm9ybWFsIGBpbnZhcmlhbnRgIGNhbGxzIHdpdGhcbi8vIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5ncy4gVGhlIG1lc3NhZ2VzIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBlcnJvciBjb2Rlc1xuLy8gZHVyaW5nIGJ1aWxkLlxuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG4vKipcbiAqIEZvcmtlZCBmcm9tIGZianMvd2FybmluZzpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mYmpzL2Jsb2IvZTY2YmEyMGFkNWJlNDMzZWI1NDQyM2YyYjA5N2Q4MjkzMjRkOWRlNi9wYWNrYWdlcy9mYmpzL3NyYy9fX2ZvcmtzX18vd2FybmluZy5qc1xuICpcbiAqIE9ubHkgY2hhbmdlIGlzIHdlIHVzZSBjb25zb2xlLndhcm4gaW5zdGVhZCBvZiBjb25zb2xlLmVycm9yLFxuICogYW5kIGRvIG5vdGhpbmcgd2hlbiAnY29uc29sZScgaXMgbm90IHN1cHBvcnRlZC5cbiAqIFRoaXMgcmVhbGx5IHNpbXBsaWZpZXMgdGhlIGNvZGUuXG4gKiAtLS1cbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xudmFyIGxvd1ByaW9yaXR5V2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG5cbiAgbG93UHJpb3JpdHlXYXJuaW5nV2l0aG91dFN0YWNrID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bsb3dQcmlvcml0eVdhcm5pbmdXaXRob3V0U3RhY2soY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIgLSAyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHByaW50V2FybmluZy5hcHBseSh2b2lkIDAsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgbG93UHJpb3JpdHlXYXJuaW5nV2l0aG91dFN0YWNrJDEgPSBsb3dQcmlvcml0eVdhcm5pbmdXaXRob3V0U3RhY2s7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmdXaXRob3V0U3RhY2soY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gOCkge1xuICAgICAgLy8gQ2hlY2sgYmVmb3JlIHRoZSBjb25kaXRpb24gdG8gY2F0Y2ggdmlvbGF0aW9ucyBlYXJseS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignd2FybmluZ1dpdGhvdXRTdGFjaygpIGN1cnJlbnRseSBzdXBwb3J0cyBhdCBtb3N0IDggYXJndW1lbnRzLicpO1xuICAgIH1cblxuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgYXJnc1dpdGhGb3JtYXQgPSBhcmdzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gJycgKyBpdGVtO1xuICAgICAgfSk7XG4gICAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTsgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAgIC8vIGJyZWFrcyBJRTk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTM2MTBcblxuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5lcnJvciwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbnZhciB3YXJuaW5nV2l0aG91dFN0YWNrJDEgPSB3YXJuaW5nV2l0aG91dFN0YWNrO1xuXG52YXIgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50ID0ge307XG5cbmZ1bmN0aW9uIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBjYWxsZXJOYW1lKSB7XG4gIHtcbiAgICB2YXIgX2NvbnN0cnVjdG9yID0gcHVibGljSW5zdGFuY2UuY29uc3RydWN0b3I7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBfY29uc3RydWN0b3IgJiYgKF9jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBfY29uc3RydWN0b3IubmFtZSkgfHwgJ1JlYWN0Q2xhc3MnO1xuICAgIHZhciB3YXJuaW5nS2V5ID0gY29tcG9uZW50TmFtZSArIFwiLlwiICsgY2FsbGVyTmFtZTtcblxuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsIFwiQ2FuJ3QgY2FsbCAlcyBvbiBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCB5ZXQgbW91bnRlZC4gXCIgKyAnVGhpcyBpcyBhIG5vLW9wLCBidXQgaXQgbWlnaHQgaW5kaWNhdGUgYSBidWcgaW4geW91ciBhcHBsaWNhdGlvbi4gJyArICdJbnN0ZWFkLCBhc3NpZ24gdG8gYHRoaXMuc3RhdGVgIGRpcmVjdGx5IG9yIGRlZmluZSBhIGBzdGF0ZSA9IHt9O2AgJyArICdjbGFzcyBwcm9wZXJ0eSB3aXRoIHRoZSBkZXNpcmVkIHN0YXRlIGluIHRoZSAlcyBjb21wb25lbnQuJywgY2FsbGVyTmFtZSwgY29tcG9uZW50TmFtZSk7XG4gICAgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldID0gdHJ1ZTtcbiAgfVxufVxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xuXG5cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGlzIGNvbXBvc2l0ZSBjb21wb25lbnQgaXMgbW91bnRlZC5cbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2Ugd2Ugd2FudCB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gICAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gICAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gICAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjb21wbGV0ZVN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAncmVwbGFjZVN0YXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBUaGlzIG9ubHkgZXhpc3RzIGJlY2F1c2UgX3BlbmRpbmdTdGF0ZSBpc1xuICAgKiBpbnRlcm5hbC4gVGhpcyBwcm92aWRlcyBhIG1lcmdpbmcgc3RyYXRlZ3kgdGhhdCBpcyBub3QgYXZhaWxhYmxlIHRvIGRlZXBcbiAgICogcHJvcGVydGllcyB3aGljaCBpcyBjb25mdXNpbmcuIFRPRE86IEV4cG9zZSBwZW5kaW5nU3RhdGUgb3IgZG9uJ3QgdXNlIGl0XG4gICAqIGR1cmluZyB0aGUgbWVyZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBOYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVTZXRTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcblxue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cblxuXG5mdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0OyAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cblxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDsgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCB1cGRhdGVyIGJ1dCB0aGUgcmVhbCBvbmUgZ2V0cyBpbmplY3RlZCBieSB0aGVcbiAgLy8gcmVuZGVyZXIuXG5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCEodHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyB8fCBwYXJ0aWFsU3RhdGUgPT0gbnVsbCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvcihcInNldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLlwiKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcbi8qKlxuICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gKlxuICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gKlxuICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAqXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5cblxuQ29tcG9uZW50LnByb3RvdHlwZS5mb3JjZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlKHRoaXMsIGNhbGxiYWNrLCAnZm9yY2VVcGRhdGUnKTtcbn07XG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xuXG5cbntcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuXG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZvciAodmFyIGZuTmFtZSBpbiBkZXByZWNhdGVkQVBJcykge1xuICAgIGlmIChkZXByZWNhdGVkQVBJcy5oYXNPd25Qcm9wZXJ0eShmbk5hbWUpKSB7XG4gICAgICBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcoZm5OYW1lLCBkZXByZWNhdGVkQVBJc1tmbk5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gQ29tcG9uZW50RHVtbXkoKSB7fVxuXG5Db21wb25lbnREdW1teS5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuLyoqXG4gKiBDb252ZW5pZW5jZSBjb21wb25lbnQgd2l0aCBkZWZhdWx0IHNoYWxsb3cgZXF1YWxpdHkgY2hlY2sgZm9yIHNDVS5cbiAqL1xuXG5mdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDsgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50OyAvLyBBdm9pZCBhbiBleHRyYSBwcm90b3R5cGUganVtcCBmb3IgdGhlc2UgbWV0aG9kcy5cblxub2JqZWN0QXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xuXG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gdHJ1ZTtcblxuLy8gYW4gaW1tdXRhYmxlIG9iamVjdCB3aXRoIGEgc2luZ2xlIG11dGFibGUgdmFsdWVcbmZ1bmN0aW9uIGNyZWF0ZVJlZigpIHtcbiAgdmFyIHJlZk9iamVjdCA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG5cbiAge1xuICAgIE9iamVjdC5zZWFsKHJlZk9iamVjdCk7XG4gIH1cblxuICByZXR1cm4gcmVmT2JqZWN0O1xufVxuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGRpc3BhdGNoZXIuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnREaXNwYXRjaGVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgYmF0Y2gncyBjb25maWd1cmF0aW9uIHN1Y2ggYXMgaG93IGxvbmcgYW4gdXBkYXRlXG4gKiBzaG91bGQgc3VzcGVuZCBmb3IgaWYgaXQgbmVlZHMgdG8uXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyA9IHtcbiAgc3VzcGVuc2U6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgb3duZXIuXG4gKlxuICogVGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIGNvbXBvbmVudCB3aG8gc2hvdWxkIG93biBhbnkgY29tcG9uZW50cyB0aGF0IGFyZVxuICogY3VycmVudGx5IGJlaW5nIGNvbnN0cnVjdGVkLlxuICovXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxudmFyIEJFRk9SRV9TTEFTSF9SRSA9IC9eKC4qKVtcXFxcXFwvXS87XG52YXIgZGVzY3JpYmVDb21wb25lbnRGcmFtZSA9IGZ1bmN0aW9uIChuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICB2YXIgc291cmNlSW5mbyA9ICcnO1xuXG4gIGlmIChzb3VyY2UpIHtcbiAgICB2YXIgcGF0aCA9IHNvdXJjZS5maWxlTmFtZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBwYXRoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG5cbiAgICB7XG4gICAgICAvLyBJbiBERVYsIGluY2x1ZGUgY29kZSBmb3IgYSBjb21tb24gc3BlY2lhbCBjYXNlOlxuICAgICAgLy8gcHJlZmVyIFwiZm9sZGVyL2luZGV4LmpzXCIgaW5zdGVhZCBvZiBqdXN0IFwiaW5kZXguanNcIi5cbiAgICAgIGlmICgvXmluZGV4XFwuLy50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBwYXRoLm1hdGNoKEJFRk9SRV9TTEFTSF9SRSk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgdmFyIHBhdGhCZWZvcmVTbGFzaCA9IG1hdGNoWzFdO1xuXG4gICAgICAgICAgaWYgKHBhdGhCZWZvcmVTbGFzaCkge1xuICAgICAgICAgICAgdmFyIGZvbGRlck5hbWUgPSBwYXRoQmVmb3JlU2xhc2gucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZm9sZGVyTmFtZSArICcvJyArIGZpbGVOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNvdXJjZUluZm8gPSAnIChhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBzb3VyY2UubGluZU51bWJlciArICcpJztcbiAgfSBlbHNlIGlmIChvd25lck5hbWUpIHtcbiAgICBzb3VyY2VJbmZvID0gJyAoY3JlYXRlZCBieSAnICsgb3duZXJOYW1lICsgJyknO1xuICB9XG5cbiAgcmV0dXJuICdcXG4gICAgaW4gJyArIChuYW1lIHx8ICdVbmtub3duJykgKyBzb3VyY2VJbmZvO1xufTtcblxudmFyIFJlc29sdmVkID0gMTtcblxuZnVuY3Rpb24gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KGxhenlDb21wb25lbnQpIHtcbiAgcmV0dXJuIGxhenlDb21wb25lbnQuX3N0YXR1cyA9PT0gUmVzb2x2ZWQgPyBsYXp5Q29tcG9uZW50Ll9yZXN1bHQgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRXcmFwcGVkTmFtZShvdXRlclR5cGUsIGlubmVyVHlwZSwgd3JhcHBlck5hbWUpIHtcbiAgdmFyIGZ1bmN0aW9uTmFtZSA9IGlubmVyVHlwZS5kaXNwbGF5TmFtZSB8fCBpbm5lclR5cGUubmFtZSB8fCAnJztcbiAgcmV0dXJuIG91dGVyVHlwZS5kaXNwbGF5TmFtZSB8fCAoZnVuY3Rpb25OYW1lICE9PSAnJyA/IHdyYXBwZXJOYW1lICsgXCIoXCIgKyBmdW5jdGlvbk5hbWUgKyBcIilcIiA6IHdyYXBwZXJOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHtcbiAgICBpZiAodHlwZW9mIHR5cGUudGFnID09PSAnbnVtYmVyJykge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZSgpLiAnICsgJ1RoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuXG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcblxuICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgIHJldHVybiBcIlByb2ZpbGVyXCI7XG5cbiAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZSc7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2VMaXN0JztcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuQ29uc3VtZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Qcm92aWRlcic7XG5cbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldFdyYXBwZWROYW1lKHR5cGUsIHR5cGUucmVuZGVyLCAnRm9yd2FyZFJlZicpO1xuXG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKTtcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgdGhlbmFibGUgPSB0eXBlO1xuICAgICAgICAgIHZhciByZXNvbHZlZFRoZW5hYmxlID0gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KHRoZW5hYmxlKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZlZFRoZW5hYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZShyZXNvbHZlZFRoZW5hYmxlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IHt9O1xudmFyIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gbnVsbDtcbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gZWxlbWVudDtcbiAgfVxufVxuXG57XG4gIC8vIFN0YWNrIGltcGxlbWVudGF0aW9uIGluamVjdGVkIGJ5IHRoZSBjdXJyZW50IHJlbmRlcmVyLlxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjayA9IG51bGw7XG5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9ICcnOyAvLyBBZGQgYW4gZXh0cmEgdG9wIGZyYW1lIHdoaWxlIGFuIGVsZW1lbnQgaXMgYmVpbmcgdmFsaWRhdGVkXG5cbiAgICBpZiAoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQpIHtcbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC50eXBlKTtcbiAgICAgIHZhciBvd25lciA9IGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9vd25lcjtcbiAgICAgIHN0YWNrICs9IGRlc2NyaWJlQ29tcG9uZW50RnJhbWUobmFtZSwgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX3NvdXJjZSwgb3duZXIgJiYgZ2V0Q29tcG9uZW50TmFtZShvd25lci50eXBlKSk7XG4gICAgfSAvLyBEZWxlZ2F0ZSB0byB0aGUgaW5qZWN0ZWQgcmVuZGVyZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25cblxuXG4gICAgdmFyIGltcGwgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjaztcblxuICAgIGlmIChpbXBsKSB7XG4gICAgICBzdGFjayArPSBpbXBsKCkgfHwgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYWN0KCkgdG8gdHJhY2sgd2hldGhlciB5b3UncmUgaW5zaWRlIGFuIGFjdCgpIHNjb3BlLlxuICovXG52YXIgSXNTb21lUmVuZGVyZXJBY3RpbmcgPSB7XG4gIGN1cnJlbnQ6IGZhbHNlXG59O1xuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSB7XG4gIFJlYWN0Q3VycmVudERpc3BhdGNoZXI6IFJlYWN0Q3VycmVudERpc3BhdGNoZXIsXG4gIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnOiBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxcbiAgUmVhY3RDdXJyZW50T3duZXI6IFJlYWN0Q3VycmVudE93bmVyLFxuICBJc1NvbWVSZW5kZXJlckFjdGluZzogSXNTb21lUmVuZGVyZXJBY3RpbmcsXG4gIC8vIFVzZWQgYnkgcmVuZGVyZXJzIHRvIGF2b2lkIGJ1bmRsaW5nIG9iamVjdC1hc3NpZ24gdHdpY2UgaW4gVU1EIGJ1bmRsZXM6XG4gIGFzc2lnbjogb2JqZWN0QXNzaWduXG59O1xuXG57XG4gIG9iamVjdEFzc2lnbihSZWFjdFNoYXJlZEludGVybmFscywge1xuICAgIC8vIFRoZXNlIHNob3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gcHJvZHVjdGlvbi5cbiAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lOiBSZWFjdERlYnVnQ3VycmVudEZyYW1lLFxuICAgIC8vIFNoaW0gZm9yIFJlYWN0IERPTSAxNi4wLjAgd2hpY2ggc3RpbGwgZGVzdHJ1Y3R1cmVkIChidXQgbm90IHVzZWQpIHRoaXMuXG4gICAgLy8gVE9ETzogcmVtb3ZlIGluIFJlYWN0IDE3LjAuXG4gICAgUmVhY3RDb21wb25lbnRUcmVlSG9vazoge31cbiAgfSk7XG59XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gd2FybmluZ1dpdGhvdXRTdGFjayQxO1xuXG57XG4gIHdhcm5pbmcgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvd2FybmluZy1hbmQtaW52YXJpYW50LWFyZ3NcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMS5hcHBseSh2b2lkIDAsIFtmYWxzZSwgZm9ybWF0ICsgJyVzJ10uY29uY2F0KGFyZ3MsIFtzdGFja10pKTtcbiAgfTtcbn1cblxudmFyIHdhcm5pbmckMSA9IHdhcm5pbmc7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSQxID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd247XG52YXIgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd247XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5JDEuY2FsbChjb25maWcsICdyZWYnKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAncmVmJykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5yZWYgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkkMS5jYWxsKGNvbmZpZywgJ2tleScpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdrZXknKS5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlnLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuXG4gIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ2tleScsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ0tleSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nUmVmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24pIHtcbiAgICAgIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJyVzOiBgcmVmYCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9mYi5tZS9yZWFjdC1zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICB9XG4gIH07XG5cbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cbi8qKlxuICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IFJlYWN0IGVsZW1lbnQuIFRoaXMgbm8gbG9uZ2VyIGFkaGVyZXMgdG9cbiAqIHRoZSBjbGFzcyBwYXR0ZXJuLCBzbyBkbyBub3QgdXNlIG5ldyB0byBjYWxsIGl0LiBBbHNvLCBpbnN0YW5jZW9mIGNoZWNrXG4gKiB3aWxsIG5vdCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBpbnRlcm5hbFxuICovXG5cblxudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3dzIHVzIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgYXMgYSBSZWFjdCBFbGVtZW50XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcbiAgICAvLyBCdWlsdC1pbiBwcm9wZXJ0aWVzIHRoYXQgYmVsb25nIG9uIHRoZSBlbGVtZW50XG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHJlZixcbiAgICBwcm9wczogcHJvcHMsXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9OyAvLyBUbyBtYWtlIGNvbXBhcmluZyBSZWFjdEVsZW1lbnRzIGVhc2llciBmb3IgdGVzdGluZyBwdXJwb3Nlcywgd2UgbWFrZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIGZsYWcgbm9uLWVudW1lcmFibGUgKHdoZXJlIHBvc3NpYmxlLCB3aGljaCBzaG91bGRcbiAgICAvLyBpbmNsdWRlIGV2ZXJ5IGVudmlyb25tZW50IHdlIHJ1biB0ZXN0cyBpbiksIHNvIHRoZSB0ZXN0IGZyYW1ld29ya1xuICAgIC8vIGlnbm9yZXMgaXQuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pOyAvLyBzZWxmIGFuZCBzb3VyY2UgYXJlIERFViBvbmx5IHByb3BlcnRpZXMuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zZWxmJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNlbGZcbiAgICB9KTsgLy8gVHdvIGVsZW1lbnRzIGNyZWF0ZWQgaW4gdHdvIGRpZmZlcmVudCBwbGFjZXMgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICAvLyBlcXVhbCBmb3IgdGVzdGluZyBwdXJwb3NlcyBhbmQgdGhlcmVmb3JlIHdlIGhpZGUgaXQgZnJvbSBlbnVtZXJhdGlvbi5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICB9KTtcblxuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG4vKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JmY3MvcHVsbC8xMDdcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKi9cblxuXG5cbi8qKlxuICogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9wdWxsLzEwN1xuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqL1xuXG5mdW5jdGlvbiBqc3hERVYodHlwZSwgY29uZmlnLCBtYXliZUtleSwgc291cmNlLCBzZWxmKSB7XG4gIHZhciBwcm9wTmFtZTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG4gIHZhciBwcm9wcyA9IHt9O1xuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7IC8vIEN1cnJlbnRseSwga2V5IGNhbiBiZSBzcHJlYWQgaW4gYXMgYSBwcm9wLiBUaGlzIGNhdXNlcyBhIHBvdGVudGlhbFxuICAvLyBpc3N1ZSBpZiBrZXkgaXMgYWxzbyBleHBsaWNpdGx5IGRlY2xhcmVkIChpZS4gPGRpdiB7Li4ucHJvcHN9IGtleT1cIkhpXCIgLz5cbiAgLy8gb3IgPGRpdiBrZXk9XCJIaVwiIHsuLi5wcm9wc30gLz4gKS4gV2Ugd2FudCB0byBkZXByZWNhdGUga2V5IHNwcmVhZCxcbiAgLy8gYnV0IGFzIGFuIGludGVybWVkaWFyeSBzdGVwLCB3ZSB3aWxsIHVzZSBqc3hERVYgZm9yIGV2ZXJ5dGhpbmcgZXhjZXB0XG4gIC8vIDxkaXYgey4uLnByb3BzfSBrZXk9XCJIaVwiIC8+LCBiZWNhdXNlIHdlIGFyZW4ndCBjdXJyZW50bHkgYWJsZSB0byB0ZWxsIGlmXG4gIC8vIGtleSBpcyBleHBsaWNpdGx5IGRlY2xhcmVkIHRvIGJlIHVuZGVmaW5lZCBvciBub3QuXG5cbiAgaWYgKG1heWJlS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBrZXkgPSAnJyArIG1heWJlS2V5O1xuICB9XG5cbiAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gIH1cblxuICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gIH0gLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuXG5cbiAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkkMS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgfVxuICB9IC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuXG5cbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGtleSB8fCByZWYpIHtcbiAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgIH1cblxuICAgIGlmIChyZWYpIHtcbiAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59XG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWU7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuICB2YXIgcHJvcHMgPSB7fTtcbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuICB2YXIgc2VsZiA9IG51bGw7XG4gIHZhciBzb3VyY2UgPSBudWxsO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTsgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eSQxLmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuXG5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG5cbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuXG4gICAge1xuICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH0gLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG5cblxuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcblxuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB7XG4gICAgaWYgKGtleSB8fCByZWYpIHtcbiAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59XG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWZhY3RvcnlcbiAqL1xuXG5cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBuZXdLZXksIG9sZEVsZW1lbnQucmVmLCBvbGRFbGVtZW50Ll9zZWxmLCBvbGRFbGVtZW50Ll9zb3VyY2UsIG9sZEVsZW1lbnQuX293bmVyLCBvbGRFbGVtZW50LnByb3BzKTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG4vKipcbiAqIENsb25lIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IHVzaW5nIGVsZW1lbnQgYXMgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjbG9uZWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICBpZiAoISEoZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSB1bmRlZmluZWQpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoXCJSZWFjdC5jbG9uZUVsZW1lbnQoLi4uKTogVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCBcIiArIGVsZW1lbnQgKyBcIi5cIik7XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb3BOYW1lOyAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG5cbiAgdmFyIHByb3BzID0gb2JqZWN0QXNzaWduKHt9LCBlbGVtZW50LnByb3BzKTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG5cbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7IC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG5cbiAgdmFyIHNlbGYgPSBlbGVtZW50Ll9zZWxmOyAvLyBTb3VyY2UgaXMgcHJlc2VydmVkIHNpbmNlIGNsb25lRWxlbWVudCBpcyB1bmxpa2VseSB0byBiZSB0YXJnZXRlZCBieSBhXG4gIC8vIHRyYW5zcGlsZXIsIGFuZCB0aGUgb3JpZ2luYWwgc291cmNlIGlzIHByb2JhYmx5IGEgYmV0dGVyIGluZGljYXRvciBvZiB0aGVcbiAgLy8gdHJ1ZSBvd25lci5cblxuICB2YXIgc291cmNlID0gZWxlbWVudC5fc291cmNlOyAvLyBPd25lciB3aWxsIGJlIHByZXNlcnZlZCwgdW5sZXNzIHJlZiBpcyBvdmVycmlkZGVuXG5cbiAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIC8vIFNpbGVudGx5IHN0ZWFsIHRoZSByZWYgZnJvbSB0aGUgcGFyZW50LlxuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIG93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH0gLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgb3ZlcnJpZGUgZXhpc3RpbmcgcHJvcHNcblxuXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcblxuICAgIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcykge1xuICAgICAgZGVmYXVsdFByb3BzID0gZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcztcbiAgICB9XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5JDEuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cblxuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuXG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cblxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQoZWxlbWVudC50eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpO1xufVxuLyoqXG4gKiBWZXJpZmllcyB0aGUgb2JqZWN0IGlzIGEgUmVhY3RFbGVtZW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNpc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBAZmluYWxcbiAqL1xuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cbi8qKlxuICogVE9ETzogVGVzdCB0aGF0IGEgc2luZ2xlIGNoaWxkIGFuZCBhbiBhcnJheSB3aXRoIG9uZSBpdGVtIGhhdmUgdGhlIHNhbWUga2V5XG4gKiBwYXR0ZXJuLlxuICovXG5cblxudmFyIGRpZFdhcm5BYm91dE1hcHMgPSBmYWxzZTtcbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5cbmZ1bmN0aW9uIGVzY2FwZVVzZXJQcm92aWRlZEtleSh0ZXh0KSB7XG4gIHJldHVybiAoJycgKyB0ZXh0KS5yZXBsYWNlKHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LCAnJCYvJyk7XG59XG5cbnZhciBQT09MX1NJWkUgPSAxMDtcbnZhciB0cmF2ZXJzZUNvbnRleHRQb29sID0gW107XG5cbmZ1bmN0aW9uIGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IHRyYXZlcnNlQ29udGV4dFBvb2wucG9wKCk7XG4gICAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICAgIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbWFwRnVuY3Rpb247XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRyYXZlcnNlQ29udGV4dDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBtYXBSZXN1bHQsXG4gICAgICBrZXlQcmVmaXg6IGtleVByZWZpeCxcbiAgICAgIGZ1bmM6IG1hcEZ1bmN0aW9uLFxuICAgICAgY29udGV4dDogbWFwQ29udGV4dCxcbiAgICAgIGNvdW50OiAwXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCkge1xuICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuXG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCA8IFBPT0xfU0laRSkge1xuICAgIHRyYXZlcnNlQ29udGV4dFBvb2wucHVzaCh0cmF2ZXJzZUNvbnRleHQpO1xuICB9XG59XG4vKipcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHshc3RyaW5nfSBuYW1lU29GYXIgTmFtZSBvZiB0aGUga2V5IHBhdGggc28gZmFyLlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRvIGludm9rZSB3aXRoIGVhY2ggY2hpbGQgZm91bmQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgVXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIHRocm91Z2hvdXQgdGhlIHRyYXZlcnNhbFxuICogcHJvY2Vzcy5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5cblxuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgdmFyIGludm9rZUNhbGxiYWNrID0gZmFsc2U7XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsKSB7XG4gICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG4gIH1cblxuICBpZiAoaW52b2tlQ2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkcmVuLCAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXIpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkO1xuICB2YXIgbmV4dE5hbWU7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG5cbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHtcbiAgICAgICAgLy8gV2FybiBhYm91dCB1c2luZyBNYXBzIGFzIGNoaWxkcmVuXG4gICAgICAgIGlmIChpdGVyYXRvckZuID09PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgICAgIWRpZFdhcm5BYm91dE1hcHMgPyB3YXJuaW5nJDEoZmFsc2UsICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIHVuc3VwcG9ydGVkIGFuZCB3aWxsIGxpa2VseSB5aWVsZCAnICsgJ3VuZXhwZWN0ZWQgcmVzdWx0cy4gQ29udmVydCBpdCB0byBhIHNlcXVlbmNlL2l0ZXJhYmxlIG9mIGtleWVkICcgKyAnUmVhY3RFbGVtZW50cyBpbnN0ZWFkLicpIDogdm9pZCAwO1xuICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHZhciBpaSA9IDA7XG5cbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG5cbiAgICAgIHtcbiAgICAgICAgYWRkZW5kdW0gPSAnIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgJyArICdpbnN0ZWFkLicgKyBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcblxuICAgICAge1xuICAgICAgICB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6IFwiICsgKGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZykgKyBcIikuXCIgKyBhZGRlbmR1bSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VidHJlZUNvdW50O1xufVxuLyoqXG4gKiBUcmF2ZXJzZXMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLCBidXRcbiAqIG1pZ2h0IGFsc28gYmUgc3BlY2lmaWVkIHRocm91Z2ggYXR0cmlidXRlczpcbiAqXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4sIC4uLilgXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMubGVmdFBhbmVsQ2hpbGRyZW4sIC4uLilgXG4gKlxuICogVGhlIGB0cmF2ZXJzZUNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgaXMgcGFzc2VkIHRocm91Z2ggdGhlXG4gKiBlbnRpcmUgdHJhdmVyc2FsLiBJdCBjYW4gYmUgdXNlZCB0byBzdG9yZSBhY2N1bXVsYXRpb25zIG9yIGFueXRoaW5nIGVsc2UgdGhhdFxuICogdGhlIGNhbGxiYWNrIG1pZ2h0IGZpbmQgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBvYmplY3QuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgVG8gaW52b2tlIHVwb24gdHJhdmVyc2luZyBlYWNoIGNoaWxkLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IENvbnRleHQgZm9yIHRyYXZlcnNhbC5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5cblxuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudCAhPT0gbnVsbCAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9IC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG5cblxuICByZXR1cm4gaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoU2luZ2xlQ2hpbGQoYm9va0tlZXBpbmcsIGNoaWxkLCBuYW1lKSB7XG4gIHZhciBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuICBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xufVxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5cblxuZnVuY3Rpb24gZm9yRWFjaENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG51bGwsIG51bGwsIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hTaW5nbGVDaGlsZCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdCxcbiAgICAgIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeCxcbiAgICAgIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG4gIHZhciBtYXBwZWRDaGlsZCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChtYXBwZWRDaGlsZCwgcmVzdWx0LCBjaGlsZEtleSwgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShtYXBwZWRDaGlsZCwgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKG1hcHBlZENoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCBhcnJheSwgcHJlZml4LCBmdW5jLCBjb250ZXh0KSB7XG4gIHZhciBlc2NhcGVkUHJlZml4ID0gJyc7XG5cbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG5cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cbi8qKlxuICogTWFwcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBrZXksIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuXG5cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmMsIGNvbnRleHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXNcbiAqIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuXG5cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgbnVsbCk7XG59XG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbnRvYXJyYXlcbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZDtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVub25seVxuICpcbiAqIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGEgc2luZ2xlIGNoaWxkIGdldHNcbiAqIHBhc3NlZCB3aXRob3V0IGEgd3JhcHBlciwgYnV0IHRoZSBwdXJwb3NlIG9mIHRoaXMgaGVscGVyIGZ1bmN0aW9uIGlzIHRvXG4gKiBhYnN0cmFjdCBhd2F5IHRoZSBwYXJ0aWN1bGFyIHN0cnVjdHVyZSBvZiBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IGNoaWxkcmVuIENoaWxkIGNvbGxlY3Rpb24gc3RydWN0dXJlLlxuICogQHJldHVybiB7UmVhY3RFbGVtZW50fSBUaGUgZmlyc3QgYW5kIG9ubHkgYFJlYWN0RWxlbWVudGAgY29udGFpbmVkIGluIHRoZVxuICogc3RydWN0dXJlLlxuICovXG5cblxuZnVuY3Rpb24gb25seUNoaWxkKGNoaWxkcmVuKSB7XG4gIGlmICghaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoXCJSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC5cIik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0KGRlZmF1bHRWYWx1ZSwgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIHtcbiAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSB1bmRlZmluZWQpIHtcbiAgICBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAge1xuICAgICAgIShjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gbnVsbCB8fCB0eXBlb2YgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09ICdmdW5jdGlvbicpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnY3JlYXRlQ29udGV4dDogRXhwZWN0ZWQgdGhlIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCB0byBiZSBhICcgKyAnZnVuY3Rpb24uIEluc3RlYWQgcmVjZWl2ZWQ6ICVzJywgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb250ZXh0ID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjYWxjdWxhdGVDaGFuZ2VkQml0cyxcbiAgICAvLyBBcyBhIHdvcmthcm91bmQgdG8gc3VwcG9ydCBtdWx0aXBsZSBjb25jdXJyZW50IHJlbmRlcmVycywgd2UgY2F0ZWdvcml6ZVxuICAgIC8vIHNvbWUgcmVuZGVyZXJzIGFzIHByaW1hcnkgYW5kIG90aGVycyBhcyBzZWNvbmRhcnkuIFdlIG9ubHkgZXhwZWN0XG4gICAgLy8gdGhlcmUgdG8gYmUgdHdvIGNvbmN1cnJlbnQgcmVuZGVyZXJzIGF0IG1vc3Q6IFJlYWN0IE5hdGl2ZSAocHJpbWFyeSkgYW5kXG4gICAgLy8gRmFicmljIChzZWNvbmRhcnkpOyBSZWFjdCBET00gKHByaW1hcnkpIGFuZCBSZWFjdCBBUlQgKHNlY29uZGFyeSkuXG4gICAgLy8gU2Vjb25kYXJ5IHJlbmRlcmVycyBzdG9yZSB0aGVpciBjb250ZXh0IHZhbHVlcyBvbiBzZXBhcmF0ZSBmaWVsZHMuXG4gICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgLy8gVXNlZCB0byB0cmFjayBob3cgbWFueSBjb25jdXJyZW50IHJlbmRlcmVycyB0aGlzIGNvbnRleHQgY3VycmVudGx5XG4gICAgLy8gc3VwcG9ydHMgd2l0aGluIGluIGEgc2luZ2xlIHJlbmRlcmVyLiBTdWNoIGFzIHBhcmFsbGVsIHNlcnZlciByZW5kZXJpbmcuXG4gICAgX3RocmVhZENvdW50OiAwLFxuICAgIC8vIFRoZXNlIGFyZSBjaXJjdWxhclxuICAgIFByb3ZpZGVyOiBudWxsLFxuICAgIENvbnN1bWVyOiBudWxsXG4gIH07XG4gIGNvbnRleHQuUHJvdmlkZXIgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1BST1ZJREVSX1RZUEUsXG4gICAgX2NvbnRleHQ6IGNvbnRleHRcbiAgfTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IGZhbHNlO1xuXG4gIHtcbiAgICAvLyBBIHNlcGFyYXRlIG9iamVjdCwgYnV0IHByb3hpZXMgYmFjayB0byB0aGUgb3JpZ2luYWwgY29udGV4dCBvYmplY3QgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIEl0IGhhcyBhIGRpZmZlcmVudCAkJHR5cGVvZiwgc28gd2UgY2FuIHByb3Blcmx5XG4gICAgLy8gd2FybiBmb3IgdGhlIGluY29ycmVjdCB1c2FnZSBvZiBDb250ZXh0IGFzIGEgQ29uc3VtZXIuXG4gICAgdmFyIENvbnN1bWVyID0ge1xuICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjb250ZXh0Ll9jYWxjdWxhdGVDaGFuZ2VkQml0c1xuICAgIH07IC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG5vdCBzZXR0aW5nIGEgdmFsdWUsIHdoaWNoIGlzIGludGVudGlvbmFsIGhlcmVcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbnN1bWVyLCB7XG4gICAgICBQcm92aWRlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuUHJvdmlkZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuUHJvdmlkZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuUHJvdmlkZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9Qcm92aWRlcikge1xuICAgICAgICAgIGNvbnRleHQuUHJvdmlkZXIgPSBfUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUgPSBfY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZTI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUyKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlMiA9IF9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX3RocmVhZENvdW50OiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll90aHJlYWRDb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX3RocmVhZENvdW50KSB7XG4gICAgICAgICAgY29udGV4dC5fdGhyZWFkQ291bnQgPSBfdGhyZWFkQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDb25zdW1lcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuQ29uc3VtZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuQ29uc3VtZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuQ29uc3VtZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTsgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbWlzc2luZyBwcm9wZXJ0aWVzIGJlY2F1c2UgaXQgZG9lc24ndCB1bmRlcnN0YW5kIGRlZmluZVByb3BlcnR5XG5cbiAgICBjb250ZXh0LkNvbnN1bWVyID0gQ29uc3VtZXI7XG4gIH1cblxuICB7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyID0gbnVsbDtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIyID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5mdW5jdGlvbiBsYXp5KGN0b3IpIHtcbiAgdmFyIGxhenlUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9MQVpZX1RZUEUsXG4gICAgX2N0b3I6IGN0b3IsXG4gICAgLy8gUmVhY3QgdXNlcyB0aGVzZSBmaWVsZHMgdG8gc3RvcmUgdGhlIHJlc3VsdC5cbiAgICBfc3RhdHVzOiAtMSxcbiAgICBfcmVzdWx0OiBudWxsXG4gIH07XG5cbiAge1xuICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoaXMgd291bGQganVzdCBzZXQgaXQgb24gdGhlIG9iamVjdC5cbiAgICB2YXIgZGVmYXVsdFByb3BzO1xuICAgIHZhciBwcm9wVHlwZXM7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobGF6eVR5cGUsIHtcbiAgICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkZWZhdWx0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld0RlZmF1bHRQcm9wcykge1xuICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYGRlZmF1bHRQcm9wc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcbiAgICAgICAgICBkZWZhdWx0UHJvcHMgPSBuZXdEZWZhdWx0UHJvcHM7IC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAnZGVmYXVsdFByb3BzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BUeXBlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3UHJvcFR5cGVzKSB7XG4gICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgcHJvcFR5cGVzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuICAgICAgICAgIHByb3BUeXBlcyA9IG5ld1Byb3BUeXBlczsgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdwcm9wVHlwZXMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsYXp5VHlwZTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJlZihyZW5kZXIpIHtcbiAge1xuICAgIGlmIChyZW5kZXIgIT0gbnVsbCAmJiByZW5kZXIuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgcmVjZWl2ZWQgYSBgbWVtb2AgJyArICdjb21wb25lbnQuIEluc3RlYWQgb2YgZm9yd2FyZFJlZihtZW1vKC4uLikpLCB1c2UgJyArICdtZW1vKGZvcndhcmRSZWYoLi4uKSkuJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCB3YXMgZ2l2ZW4gJXMuJywgcmVuZGVyID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICEoIC8vIERvIG5vdCB3YXJuIGZvciAwIGFyZ3VtZW50cyBiZWNhdXNlIGl0IGNvdWxkIGJlIGR1ZSB0byB1c2FnZSBvZiB0aGUgJ2FyZ3VtZW50cycgb2JqZWN0XG4gICAgICByZW5kZXIubGVuZ3RoID09PSAwIHx8IHJlbmRlci5sZW5ndGggPT09IDIpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGFjY2VwdCBleGFjdGx5IHR3byBwYXJhbWV0ZXJzOiBwcm9wcyBhbmQgcmVmLiAlcycsIHJlbmRlci5sZW5ndGggPT09IDEgPyAnRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyPycgOiAnQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLicpIDogdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXIgIT0gbnVsbCkge1xuICAgICAgIShyZW5kZXIuZGVmYXVsdFByb3BzID09IG51bGwgJiYgcmVuZGVyLnByb3BUeXBlcyA9PSBudWxsKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBwcm9wVHlwZXMgb3IgZGVmYXVsdFByb3BzLiAnICsgJ0RpZCB5b3UgYWNjaWRlbnRhbGx5IHBhc3MgYSBSZWFjdCBjb21wb25lbnQ/JykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSxcbiAgICByZW5kZXI6IHJlbmRlclxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IC8vIE5vdGU6IGl0cyB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyBpZiBpdCdzIGEgcG9seWZpbGwuXG4gIHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9SRVNQT05ERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9TQ09QRV9UWVBFKTtcbn1cblxuZnVuY3Rpb24gbWVtbyh0eXBlLCBjb21wYXJlKSB7XG4gIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSkge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnbWVtbzogVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBjb21wb25lbnQuIEluc3RlYWQgJyArICdyZWNlaXZlZDogJXMnLCB0eXBlID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGNvbXBhcmU6IGNvbXBhcmUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb21wYXJlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVEaXNwYXRjaGVyKCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudDtcblxuICBpZiAoIShkaXNwYXRjaGVyICE9PSBudWxsKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKFwiSW52YWxpZCBob29rIGNhbGwuIEhvb2tzIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGJvZHkgb2YgYSBmdW5jdGlvbiBjb21wb25lbnQuIFRoaXMgY291bGQgaGFwcGVuIGZvciBvbmUgb2YgdGhlIGZvbGxvd2luZyByZWFzb25zOlxcbjEuIFlvdSBtaWdodCBoYXZlIG1pc21hdGNoaW5nIHZlcnNpb25zIG9mIFJlYWN0IGFuZCB0aGUgcmVuZGVyZXIgKHN1Y2ggYXMgUmVhY3QgRE9NKVxcbjIuIFlvdSBtaWdodCBiZSBicmVha2luZyB0aGUgUnVsZXMgb2YgSG9va3NcXG4zLiBZb3UgbWlnaHQgaGF2ZSBtb3JlIHRoYW4gb25lIGNvcHkgb2YgUmVhY3QgaW4gdGhlIHNhbWUgYXBwXFxuU2VlIGh0dHBzOi8vZmIubWUvcmVhY3QtaW52YWxpZC1ob29rLWNhbGwgZm9yIHRpcHMgYWJvdXQgaG93IHRvIGRlYnVnIGFuZCBmaXggdGhpcyBwcm9ibGVtLlwiKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuZnVuY3Rpb24gdXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuXG4gIHtcbiAgICAhKHVuc3RhYmxlX29ic2VydmVkQml0cyA9PT0gdW5kZWZpbmVkKSA/IHdhcm5pbmckMShmYWxzZSwgJ3VzZUNvbnRleHQoKSBzZWNvbmQgYXJndW1lbnQgaXMgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSAnICsgJ3VzZSBpbiBSZWFjdC4gUGFzc2luZyBpdCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ1lvdSBwYXNzZWQ6ICVzLiVzJywgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzLCB0eXBlb2YgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1syXSkgPyAnXFxuXFxuRGlkIHlvdSBjYWxsIGFycmF5Lm1hcCh1c2VDb250ZXh0KT8gJyArICdDYWxsaW5nIEhvb2tzIGluc2lkZSBhIGxvb3AgaXMgbm90IHN1cHBvcnRlZC4gJyArICdMZWFybiBtb3JlIGF0IGh0dHBzOi8vZmIubWUvcnVsZXMtb2YtaG9va3MnIDogJycpIDogdm9pZCAwOyAvLyBUT0RPOiBhZGQgYSBtb3JlIGdlbmVyaWMgd2FybmluZyBmb3IgaW52YWxpZCB2YWx1ZXMuXG5cbiAgICBpZiAoQ29udGV4dC5fY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcmVhbENvbnRleHQgPSBDb250ZXh0Ll9jb250ZXh0OyAvLyBEb24ndCBkZWR1cGxpY2F0ZSBiZWNhdXNlIHRoaXMgbGVnaXRpbWF0ZWx5IGNhdXNlcyBidWdzXG4gICAgICAvLyBhbmQgbm9ib2R5IHNob3VsZCBiZSB1c2luZyB0aGlzIGluIGV4aXN0aW5nIGNvZGUuXG5cbiAgICAgIGlmIChyZWFsQ29udGV4dC5Db25zdW1lciA9PT0gQ29udGV4dCkge1xuICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Db25zdW1lcikgaXMgbm90IHN1cHBvcnRlZCwgbWF5IGNhdXNlIGJ1Z3MsIGFuZCB3aWxsIGJlICcgKyAncmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9IGVsc2UgaWYgKHJlYWxDb250ZXh0LlByb3ZpZGVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LlByb3ZpZGVyKSBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0RpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cyk7XG59XG5mdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xufVxuZnVuY3Rpb24gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbn1cbmZ1bmN0aW9uIHVzZVJlZihpbml0aWFsVmFsdWUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWYoaW5pdGlhbFZhbHVlKTtcbn1cbmZ1bmN0aW9uIHVzZUVmZmVjdChjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUVmZmVjdChjcmVhdGUsIGlucHV0cyk7XG59XG5mdW5jdGlvbiB1c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuZnVuY3Rpb24gdXNlQ2FsbGJhY2soY2FsbGJhY2ssIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBpbnB1dHMpO1xufVxuZnVuY3Rpb24gdXNlTWVtbyhjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZU1lbW8oY3JlYXRlLCBpbnB1dHMpO1xufVxuZnVuY3Rpb24gdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgaW5wdXRzKTtcbn1cbmZ1bmN0aW9uIHVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKSB7XG4gIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gICAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pO1xuICB9XG59XG52YXIgZW1wdHlPYmplY3QkMSA9IHt9O1xuZnVuY3Rpb24gdXNlUmVzcG9uZGVyKHJlc3BvbmRlciwgbGlzdGVuZXJQcm9wcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG5cbiAge1xuICAgIGlmIChyZXNwb25kZXIgPT0gbnVsbCB8fCByZXNwb25kZXIuJCR0eXBlb2YgIT09IFJFQUNUX1JFU1BPTkRFUl9UWVBFKSB7XG4gICAgICB3YXJuaW5nJDEoZmFsc2UsICd1c2VSZXNwb25kZXI6IGludmFsaWQgZmlyc3QgYXJndW1lbnQuIEV4cGVjdGVkIGFuIGV2ZW50IHJlc3BvbmRlciwgYnV0IGluc3RlYWQgZ290ICVzJywgcmVzcG9uZGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZXNwb25kZXIocmVzcG9uZGVyLCBsaXN0ZW5lclByb3BzIHx8IGVtcHR5T2JqZWN0JDEpO1xufVxuZnVuY3Rpb24gdXNlVHJhbnNpdGlvbihjb25maWcpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VUcmFuc2l0aW9uKGNvbmZpZyk7XG59XG5mdW5jdGlvbiB1c2VEZWZlcnJlZFZhbHVlKHZhbHVlLCBjb25maWcpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VEZWZlcnJlZFZhbHVlKHZhbHVlLCBjb25maWcpO1xufVxuXG5mdW5jdGlvbiB3aXRoU3VzcGVuc2VDb25maWcoc2NvcGUsIGNvbmZpZykge1xuICB2YXIgcHJldmlvdXNDb25maWcgPSBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZy5zdXNwZW5zZTtcbiAgUmVhY3RDdXJyZW50QmF0Y2hDb25maWcuc3VzcGVuc2UgPSBjb25maWcgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWc7XG5cbiAgdHJ5IHtcbiAgICBzY29wZSgpO1xuICB9IGZpbmFsbHkge1xuICAgIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnLnN1c3BlbnNlID0gcHJldmlvdXNDb25maWc7XG4gIH1cbn1cblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5cblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0JDEgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXRfMSA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0JDE7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuXG5cbnZhciBwcmludFdhcm5pbmckMSA9IGZ1bmN0aW9uKCkge307XG5cbntcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gUmVhY3RQcm9wVHlwZXNTZWNyZXRfMTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuICB2YXIgaGFzID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4gIHByaW50V2FybmluZyQxID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAoaGFzKHR5cGVTcGVjcywgdHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArXG4gICAgICAgICAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nJDEoXG4gICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAnICtcbiAgICAgICAgICAgIGxvY2F0aW9uICsgJyBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJyArIHR5cGVvZiBlcnJvciArICcuICcgK1xuICAgICAgICAgICAgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArXG4gICAgICAgICAgICAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICBwcmludFdhcm5pbmckMShcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzZXRzIHdhcm5pbmcgY2FjaGUgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gIHtcbiAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgfVxufTtcblxudmFyIGNoZWNrUHJvcFR5cGVzXzEgPSBjaGVja1Byb3BUeXBlcztcblxuLyoqXG4gKiBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgcHJvdmlkZXMgYSB3cmFwcGVyIGFyb3VuZCBhIGVsZW1lbnQgZmFjdG9yeVxuICogd2hpY2ggdmFsaWRhdGVzIHRoZSBwcm9wcyBwYXNzZWQgdG8gdGhlIGVsZW1lbnQuIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmVcbiAqIHVzZWQgb25seSBpbiBERVYgYW5kIGNvdWxkIGJlIHJlcGxhY2VkIGJ5IGEgc3RhdGljIHR5cGUgY2hlY2tlciBmb3IgbGFuZ3VhZ2VzXG4gKiB0aGF0IHN1cHBvcnQgaXQuXG4gKi9cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bjtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkkMiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpIHtcbiAgaWYgKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShzb3VyY2UpIHtcbiAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMoZWxlbWVudFByb3BzKSB7XG4gIGlmIChlbGVtZW50UHJvcHMgIT09IG51bGwgJiYgZWxlbWVudFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oZWxlbWVudFByb3BzLl9fc291cmNlKTtcbiAgfVxuXG4gIHJldHVybiAnJztcbn1cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG5cblxudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAgdmFyIGluZm8gPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcblxuICBpZiAoIWluZm8pIHtcbiAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcblxuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICBpbmZvID0gXCJcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDxcIiArIHBhcmVudE5hbWUgKyBcIj4uXCI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZm87XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIGlmICghZWxlbWVudC5fc3RvcmUgfHwgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkIHx8IGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG5cbiAgaWYgKG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7IC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG5cbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5fb3duZXIgJiYgZWxlbWVudC5fb3duZXIgIT09IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjb21wb25lbnQgdGhhdCBvcmlnaW5hbGx5IGNyZWF0ZWQgdGhpcyBjaGlsZC5cbiAgICBjaGlsZE93bmVyID0gXCIgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gXCIgKyBnZXRDb21wb25lbnROYW1lKGVsZW1lbnQuX293bmVyLnR5cGUpICsgXCIuXCI7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICB7XG4gICAgd2FybmluZyQxKGZhbHNlLCAnRWFjaCBjaGlsZCBpbiBhIGxpc3Qgc2hvdWxkIGhhdmUgYSB1bmlxdWUgXCJrZXlcIiBwcm9wLicgKyAnJXMlcyBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lcik7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cbi8qKlxuICogRW5zdXJlIHRoYXQgZXZlcnkgZWxlbWVudCBlaXRoZXIgaXMgcGFzc2VkIGluIGEgc3RhdGljIGxvY2F0aW9uLCBpbiBhblxuICogYXJyYXkgd2l0aCBhbiBleHBsaWNpdCBrZXlzIHByb3BlcnR5IGRlZmluZWQsIG9yIGluIGFuIG9iamVjdCBsaXRlcmFsXG4gKiB3aXRoIHZhbGlkIGtleSBwcm9wZXJ0eS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3ROb2RlfSBub2RlIFN0YXRpY2FsbHkgcGFzc2VkIGNoaWxkIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIG5vZGUncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG5cbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG5cbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgIC8vIGJ1dCBub3cgd2UgcHJpbnQgYSBzZXBhcmF0ZSB3YXJuaW5nIGZvciB0aGVtIGxhdGVyLlxuICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgIHZhciBzdGVwO1xuXG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEdpdmVuIGFuIGVsZW1lbnQsIHZhbGlkYXRlIHRoYXQgaXRzIHByb3BzIGZvbGxvdyB0aGUgcHJvcFR5cGVzIGRlZmluaXRpb24sXG4gKiBwcm92aWRlZCBieSB0aGUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcblxuICBpZiAodHlwZSA9PT0gbnVsbCB8fCB0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHR5cGUpO1xuICB2YXIgcHJvcFR5cGVzO1xuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gIC8vIElubmVyIHByb3BzIGFyZSBjaGVja2VkIGluIHRoZSByZWNvbmNpbGVyLlxuICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHByb3BUeXBlcykge1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuICAgIGNoZWNrUHJvcFR5cGVzXzEocHJvcFR5cGVzLCBlbGVtZW50LnByb3BzLCAncHJvcCcsIG5hbWUsIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSk7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gIH0gZWxzZSBpZiAodHlwZS5Qcm9wVHlwZXMgIT09IHVuZGVmaW5lZCAmJiAhcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24pIHtcbiAgICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnQ29tcG9uZW50ICVzIGRlY2xhcmVkIGBQcm9wVHlwZXNgIGluc3RlYWQgb2YgYHByb3BUeXBlc2AuIERpZCB5b3UgbWlzc3BlbGwgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnQ/JywgbmFtZSB8fCAnVW5rbm93bicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICF0eXBlLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2dldERlZmF1bHRQcm9wcyBpcyBvbmx5IHVzZWQgb24gY2xhc3NpYyBSZWFjdC5jcmVhdGVDbGFzcyAnICsgJ2RlZmluaXRpb25zLiBVc2UgYSBzdGF0aWMgcHJvcGVydHkgbmFtZWQgYGRlZmF1bHRQcm9wc2AgaW5zdGVhZC4nKSA6IHZvaWQgMDtcbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGZyYWdtZW50KTtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcmFnbWVudC5wcm9wcyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG5cbiAgICBpZiAoa2V5ICE9PSAnY2hpbGRyZW4nICYmIGtleSAhPT0gJ2tleScpIHtcbiAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0ludmFsaWQgcHJvcCBgJXNgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuICcgKyAnUmVhY3QuRnJhZ21lbnQgY2FuIG9ubHkgaGF2ZSBga2V5YCBhbmQgYGNoaWxkcmVuYCBwcm9wcy4nLCBrZXkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgIHdhcm5pbmckMShmYWxzZSwgJ0ludmFsaWQgYXR0cmlidXRlIGByZWZgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuJyk7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cblxuZnVuY3Rpb24ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgaXNTdGF0aWNDaGlsZHJlbiwgc291cmNlLCBzZWxmKSB7XG4gIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7IC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG5cbiAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuXG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShzb3VyY2UpO1xuXG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZztcblxuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gXCI8XCIgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyBcIiAvPlwiO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QuanN4OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICB9XG5cbiAgdmFyIGVsZW1lbnQgPSBqc3hERVYodHlwZSwgcHJvcHMsIGtleSwgc291cmNlLCBzZWxmKTsgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuXG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuXG5cbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIHZhciBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuXG4gICAgaWYgKGNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChpc1N0YXRpY0NoaWxkcmVuKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGNoaWxkcmVuW2ldLCB0eXBlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZHJlbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmpzeDogU3RhdGljIGNoaWxkcmVuIHNob3VsZCBhbHdheXMgYmUgYW4gYXJyYXkuICcgKyAnWW91IGFyZSBsaWtlbHkgZXhwbGljaXRseSBjYWxsaW5nIFJlYWN0LmpzeHMgb3IgUmVhY3QuanN4REVWLiAnICsgJ1VzZSB0aGUgQmFiZWwgdHJhbnNmb3JtIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGNoaWxkcmVuLCB0eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaGFzT3duUHJvcGVydHkkMi5jYWxsKHByb3BzLCAna2V5JykpIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5qc3g6IFNwcmVhZGluZyBhIGtleSB0byBKU1ggaXMgYSBkZXByZWNhdGVkIHBhdHRlcm4uICcgKyAnRXhwbGljaXRseSBwYXNzIGEga2V5IGFmdGVyIHNwcmVhZGluZyBwcm9wcyBpbiB5b3VyIEpTWCBjYWxsLiAnICsgJ0UuZy4gPENvbXBvbmVudE5hbWUgey4uLnByb3BzfSBrZXk9e2tleX0gLz4nKTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59IC8vIFRoZXNlIHR3byBmdW5jdGlvbnMgZXhpc3QgdG8gc3RpbGwgZ2V0IGNoaWxkIHdhcm5pbmdzIGluIGRldlxuLy8gZXZlbiB3aXRoIHRoZSBwcm9kIHRyYW5zZm9ybS4gVGhpcyBtZWFucyB0aGF0IGpzeERFViBpcyBwdXJlbHlcbi8vIG9wdC1pbiBiZWhhdmlvciBmb3IgYmV0dGVyIG1lc3NhZ2VzIGJ1dCB0aGF0IHdlIHdvbid0IHN0b3Bcbi8vIGdpdmluZyB5b3Ugd2FybmluZ3MgaWYgeW91IHVzZSBwcm9kdWN0aW9uIGFwaXMuXG5cbmZ1bmN0aW9uIGpzeFdpdGhWYWxpZGF0aW9uU3RhdGljKHR5cGUsIHByb3BzLCBrZXkpIHtcbiAgcmV0dXJuIGpzeFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBrZXksIHRydWUpO1xufVxuZnVuY3Rpb24ganN4V2l0aFZhbGlkYXRpb25EeW5hbWljKHR5cGUsIHByb3BzLCBrZXkpIHtcbiAgcmV0dXJuIGpzeFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBrZXksIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTsgLy8gV2Ugd2FybiBpbiB0aGlzIGNhc2UgYnV0IGRvbid0IHRocm93LiBXZSBleHBlY3QgdGhlIGVsZW1lbnQgY3JlYXRpb24gdG9cbiAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG5cbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaW5mbyArPSAnIFlvdSBsaWtlbHkgZm9yZ290IHRvIGV4cG9ydCB5b3VyIGNvbXBvbmVudCBmcm9tIHRoZSBmaWxlICcgKyBcIml0J3MgZGVmaW5lZCBpbiwgb3IgeW91IG1pZ2h0IGhhdmUgbWl4ZWQgdXAgZGVmYXVsdCBhbmQgbmFtZWQgaW1wb3J0cy5cIjtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMocHJvcHMpO1xuXG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZztcblxuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gXCI8XCIgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyBcIiAvPlwiO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyAvLyBUaGUgcmVzdWx0IGNhbiBiZSBudWxsaXNoIGlmIGEgbW9jayBvciBhIGN1c3RvbSBmdW5jdGlvbiBpcyB1c2VkLlxuICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9IC8vIFNraXAga2V5IHdhcm5pbmcgaWYgdGhlIHR5cGUgaXNuJ3QgdmFsaWQgc2luY2Ugb3VyIGtleSB2YWxpZGF0aW9uIGxvZ2ljXG4gIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAvLyAoUmVuZGVyaW5nIHdpbGwgdGhyb3cgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZSBhbmQgYXMgc29vbiBhcyB0aGUgdHlwZSBpc1xuICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG5cblxuICBpZiAodmFsaWRUeXBlKSB7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUpIHtcbiAgICB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZWxlbWVudCk7XG4gIH0gZWxzZSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbih0eXBlKSB7XG4gIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLmJpbmQobnVsbCwgdHlwZSk7XG4gIHZhbGlkYXRlZEZhY3RvcnkudHlwZSA9IHR5cGU7IC8vIExlZ2FjeSBob29rOiByZW1vdmUgaXRcblxuICB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbGlkYXRlZEZhY3RvcnksICd0eXBlJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdGYWN0b3J5LnR5cGUgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHRoZSBjbGFzcyBkaXJlY3RseSAnICsgJ2JlZm9yZSBwYXNzaW5nIGl0IHRvIGNyZWF0ZUZhY3RvcnkuJyk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICB2YWx1ZTogdHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbn1cbmZ1bmN0aW9uIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgbmV3RWxlbWVudCA9IGNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICB9XG5cbiAgdmFsaWRhdGVQcm9wVHlwZXMobmV3RWxlbWVudCk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuXG52YXIgZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nID0gZmFsc2U7XG52YXIgZW5hYmxlSXNJbnB1dFBlbmRpbmcgPSBmYWxzZTtcbnZhciBlbmFibGVQcm9maWxpbmcgPSB0cnVlO1xuXG52YXIgcmVxdWVzdEhvc3RDYWxsYmFjaztcblxudmFyIHJlcXVlc3RIb3N0VGltZW91dDtcbnZhciBjYW5jZWxIb3N0VGltZW91dDtcbnZhciBzaG91bGRZaWVsZFRvSG9zdDtcbnZhciByZXF1ZXN0UGFpbnQ7XG52YXIgZ2V0Q3VycmVudFRpbWU7XG52YXIgZm9yY2VGcmFtZVJhdGU7XG5cbmlmICggLy8gSWYgU2NoZWR1bGVyIHJ1bnMgaW4gYSBub24tRE9NIGVudmlyb25tZW50LCBpdCBmYWxscyBiYWNrIHRvIGEgbmFpdmVcbi8vIGltcGxlbWVudGF0aW9uIHVzaW5nIHNldFRpbWVvdXQuXG50eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAvLyBDaGVjayBpZiBNZXNzYWdlQ2hhbm5lbCBpcyBzdXBwb3J0ZWQsIHRvby5cbnR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ2Z1bmN0aW9uJykge1xuICAvLyBJZiB0aGlzIGFjY2lkZW50YWxseSBnZXRzIGltcG9ydGVkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnQsIGUuZy4gSmF2YVNjcmlwdENvcmUsXG4gIC8vIGZhbGxiYWNrIHRvIGEgbmFpdmUgaW1wbGVtZW50YXRpb24uXG4gIHZhciBfY2FsbGJhY2sgPSBudWxsO1xuICB2YXIgX3RpbWVvdXRJRCA9IG51bGw7XG5cbiAgdmFyIF9mbHVzaENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChfY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBjdXJyZW50VGltZSA9IGdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHZhciBoYXNSZW1haW5pbmdUaW1lID0gdHJ1ZTtcblxuICAgICAgICBfY2FsbGJhY2soaGFzUmVtYWluaW5nVGltZSwgY3VycmVudFRpbWUpO1xuXG4gICAgICAgIF9jYWxsYmFjayA9IG51bGw7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoX2ZsdXNoQ2FsbGJhY2ssIDApO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgaW5pdGlhbFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gIGdldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBEYXRlLm5vdygpIC0gaW5pdGlhbFRpbWU7XG4gIH07XG5cbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGZ1bmN0aW9uIChjYikge1xuICAgIGlmIChfY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIC8vIFByb3RlY3QgYWdhaW5zdCByZS1lbnRyYW5jeS5cbiAgICAgIHNldFRpbWVvdXQocmVxdWVzdEhvc3RDYWxsYmFjaywgMCwgY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfY2FsbGJhY2sgPSBjYjtcbiAgICAgIHNldFRpbWVvdXQoX2ZsdXNoQ2FsbGJhY2ssIDApO1xuICAgIH1cbiAgfTtcblxuICByZXF1ZXN0SG9zdFRpbWVvdXQgPSBmdW5jdGlvbiAoY2IsIG1zKSB7XG4gICAgX3RpbWVvdXRJRCA9IHNldFRpbWVvdXQoY2IsIG1zKTtcbiAgfTtcblxuICBjYW5jZWxIb3N0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhclRpbWVvdXQoX3RpbWVvdXRJRCk7XG4gIH07XG5cbiAgc2hvdWxkWWllbGRUb0hvc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJlcXVlc3RQYWludCA9IGZvcmNlRnJhbWVSYXRlID0gZnVuY3Rpb24gKCkge307XG59IGVsc2Uge1xuICAvLyBDYXB0dXJlIGxvY2FsIHJlZmVyZW5jZXMgdG8gbmF0aXZlIEFQSXMsIGluIGNhc2UgYSBwb2x5ZmlsbCBvdmVycmlkZXMgdGhlbS5cbiAgdmFyIHBlcmZvcm1hbmNlID0gd2luZG93LnBlcmZvcm1hbmNlO1xuICB2YXIgX0RhdGUgPSB3aW5kb3cuRGF0ZTtcbiAgdmFyIF9zZXRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQ7XG4gIHZhciBfY2xlYXJUaW1lb3V0ID0gd2luZG93LmNsZWFyVGltZW91dDtcblxuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gVE9ETzogU2NoZWR1bGVyIG5vIGxvbmdlciByZXF1aXJlcyB0aGVzZSBtZXRob2RzIHRvIGJlIHBvbHlmaWxsZWQuIEJ1dFxuICAgIC8vIG1heWJlIHdlIHdhbnQgdG8gY29udGludWUgd2FybmluZyBpZiB0aGV5IGRvbid0IGV4aXN0LCB0byBwcmVzZXJ2ZSB0aGVcbiAgICAvLyBvcHRpb24gdG8gcmVseSBvbiBpdCBpbiB0aGUgZnV0dXJlP1xuICAgIHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgIHZhciBjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTsgLy8gVE9ETzogUmVtb3ZlIGZiLm1lIGxpbmtcblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuIFwiICsgJ01ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgJyArICdwb2x5ZmlsbCBpbiBvbGRlciBicm93c2Vycy4gaHR0cHM6Ly9mYi5tZS9yZWFjdC1wb2x5ZmlsbHMnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBjYW5jZWxBbmltYXRpb25GcmFtZS4gXCIgKyAnTWFrZSBzdXJlIHRoYXQgeW91IGxvYWQgYSAnICsgJ3BvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL2ZiLm1lL3JlYWN0LXBvbHlmaWxscycpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgcGVyZm9ybWFuY2UgPT09ICdvYmplY3QnICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbicpIHtcbiAgICBnZXRDdXJyZW50VGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHZhciBfaW5pdGlhbFRpbWUgPSBfRGF0ZS5ub3coKTtcblxuICAgIGdldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF9EYXRlLm5vdygpIC0gX2luaXRpYWxUaW1lO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNNZXNzYWdlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgdmFyIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IG51bGw7XG4gIHZhciB0YXNrVGltZW91dElEID0gLTE7IC8vIFNjaGVkdWxlciBwZXJpb2RpY2FsbHkgeWllbGRzIGluIGNhc2UgdGhlcmUgaXMgb3RoZXIgd29yayBvbiB0aGUgbWFpblxuICAvLyB0aHJlYWQsIGxpa2UgdXNlciBldmVudHMuIEJ5IGRlZmF1bHQsIGl0IHlpZWxkcyBtdWx0aXBsZSB0aW1lcyBwZXIgZnJhbWUuXG4gIC8vIEl0IGRvZXMgbm90IGF0dGVtcHQgdG8gYWxpZ24gd2l0aCBmcmFtZSBib3VuZGFyaWVzLCBzaW5jZSBtb3N0IHRhc2tzIGRvbid0XG4gIC8vIG5lZWQgdG8gYmUgZnJhbWUgYWxpZ25lZDsgZm9yIHRob3NlIHRoYXQgZG8sIHVzZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuXG5cbiAgdmFyIHlpZWxkSW50ZXJ2YWwgPSA1O1xuICB2YXIgZGVhZGxpbmUgPSAwOyAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlXG4gIC8vIFRPRE86IEFkanVzdCB0aGlzIGJhc2VkIG9uIHByaW9yaXR5P1xuXG4gIHZhciBtYXhZaWVsZEludGVydmFsID0gMzAwO1xuICB2YXIgbmVlZHNQYWludCA9IGZhbHNlO1xuXG4gIGlmIChlbmFibGVJc0lucHV0UGVuZGluZyAmJiBuYXZpZ2F0b3IgIT09IHVuZGVmaW5lZCAmJiBuYXZpZ2F0b3Iuc2NoZWR1bGluZyAhPT0gdW5kZWZpbmVkICYmIG5hdmlnYXRvci5zY2hlZHVsaW5nLmlzSW5wdXRQZW5kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgc2NoZWR1bGluZyA9IG5hdmlnYXRvci5zY2hlZHVsaW5nO1xuXG4gICAgc2hvdWxkWWllbGRUb0hvc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBnZXRDdXJyZW50VGltZSgpO1xuXG4gICAgICBpZiAoY3VycmVudFRpbWUgPj0gZGVhZGxpbmUpIHtcbiAgICAgICAgLy8gVGhlcmUncyBubyB0aW1lIGxlZnQuIFdlIG1heSB3YW50IHRvIHlpZWxkIGNvbnRyb2wgb2YgdGhlIG1haW5cbiAgICAgICAgLy8gdGhyZWFkLCBzbyB0aGUgYnJvd3NlciBjYW4gcGVyZm9ybSBoaWdoIHByaW9yaXR5IHRhc2tzLiBUaGUgbWFpbiBvbmVzXG4gICAgICAgIC8vIGFyZSBwYWludGluZyBhbmQgdXNlciBpbnB1dC4gSWYgdGhlcmUncyBhIHBlbmRpbmcgcGFpbnQgb3IgYSBwZW5kaW5nXG4gICAgICAgIC8vIGlucHV0LCB0aGVuIHdlIHNob3VsZCB5aWVsZC4gQnV0IGlmIHRoZXJlJ3MgbmVpdGhlciwgdGhlbiB3ZSBjYW5cbiAgICAgICAgLy8geWllbGQgbGVzcyBvZnRlbiB3aGlsZSByZW1haW5pbmcgcmVzcG9uc2l2ZS4gV2UnbGwgZXZlbnR1YWxseSB5aWVsZFxuICAgICAgICAvLyByZWdhcmRsZXNzLCBzaW5jZSB0aGVyZSBjb3VsZCBiZSBhIHBlbmRpbmcgcGFpbnQgdGhhdCB3YXNuJ3RcbiAgICAgICAgLy8gYWNjb21wYW5pZWQgYnkgYSBjYWxsIHRvIGByZXF1ZXN0UGFpbnRgLCBvciBvdGhlciBtYWluIHRocmVhZCB0YXNrc1xuICAgICAgICAvLyBsaWtlIG5ldHdvcmsgZXZlbnRzLlxuICAgICAgICBpZiAobmVlZHNQYWludCB8fCBzY2hlZHVsaW5nLmlzSW5wdXRQZW5kaW5nKCkpIHtcbiAgICAgICAgICAvLyBUaGVyZSBpcyBlaXRoZXIgYSBwZW5kaW5nIHBhaW50IG9yIGEgcGVuZGluZyBpbnB1dC5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSAvLyBUaGVyZSdzIG5vIHBlbmRpbmcgaW5wdXQuIE9ubHkgeWllbGQgaWYgd2UndmUgcmVhY2hlZCB0aGUgbWF4XG4gICAgICAgIC8vIHlpZWxkIGludGVydmFsLlxuXG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRUaW1lID49IG1heFlpZWxkSW50ZXJ2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGVyZSdzIHN0aWxsIHRpbWUgbGVmdCBpbiB0aGUgZnJhbWUuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVxdWVzdFBhaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbmVlZHNQYWludCA9IHRydWU7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBgaXNJbnB1dFBlbmRpbmdgIGlzIG5vdCBhdmFpbGFibGUuIFNpbmNlIHdlIGhhdmUgbm8gd2F5IG9mIGtub3dpbmcgaWZcbiAgICAvLyB0aGVyZSdzIHBlbmRpbmcgaW5wdXQsIGFsd2F5cyB5aWVsZCBhdCB0aGUgZW5kIG9mIHRoZSBmcmFtZS5cbiAgICBzaG91bGRZaWVsZFRvSG9zdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBnZXRDdXJyZW50VGltZSgpID49IGRlYWRsaW5lO1xuICAgIH07IC8vIFNpbmNlIHdlIHlpZWxkIGV2ZXJ5IGZyYW1lIHJlZ2FyZGxlc3MsIGByZXF1ZXN0UGFpbnRgIGhhcyBubyBlZmZlY3QuXG5cblxuICAgIHJlcXVlc3RQYWludCA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG5cbiAgZm9yY2VGcmFtZVJhdGUgPSBmdW5jdGlvbiAoZnBzKSB7XG4gICAgaWYgKGZwcyA8IDAgfHwgZnBzID4gMTI1KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JjZUZyYW1lUmF0ZSB0YWtlcyBhIHBvc2l0aXZlIGludCBiZXR3ZWVuIDAgYW5kIDEyNSwgJyArICdmb3JjaW5nIGZyYW1lcmF0ZXMgaGlnaGVyIHRoYW4gMTI1IGZwcyBpcyBub3QgdW5zdXBwb3J0ZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZnBzID4gMCkge1xuICAgICAgeWllbGRJbnRlcnZhbCA9IE1hdGguZmxvb3IoMTAwMCAvIGZwcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlc2V0IHRoZSBmcmFtZXJhdGVcbiAgICAgIHlpZWxkSW50ZXJ2YWwgPSA1O1xuICAgIH1cbiAgfTtcblxuICB2YXIgcGVyZm9ybVdvcmtVbnRpbERlYWRsaW5lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIHZhciBjdXJyZW50VGltZSA9IGdldEN1cnJlbnRUaW1lKCk7IC8vIFlpZWxkIGFmdGVyIGB5aWVsZEludGVydmFsYCBtcywgcmVnYXJkbGVzcyBvZiB3aGVyZSB3ZSBhcmUgaW4gdGhlIHZzeW5jXG4gICAgICAvLyBjeWNsZS4gVGhpcyBtZWFucyB0aGVyZSdzIGFsd2F5cyB0aW1lIHJlbWFpbmluZyBhdCB0aGUgYmVnaW5uaW5nIG9mXG4gICAgICAvLyB0aGUgbWVzc2FnZSBldmVudC5cblxuICAgICAgZGVhZGxpbmUgPSBjdXJyZW50VGltZSArIHlpZWxkSW50ZXJ2YWw7XG4gICAgICB2YXIgaGFzVGltZVJlbWFpbmluZyA9IHRydWU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBoYXNNb3JlV29yayA9IHNjaGVkdWxlZEhvc3RDYWxsYmFjayhoYXNUaW1lUmVtYWluaW5nLCBjdXJyZW50VGltZSk7XG5cbiAgICAgICAgaWYgKCFoYXNNb3JlV29yaykge1xuICAgICAgICAgIGlzTWVzc2FnZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSdzIG1vcmUgd29yaywgc2NoZWR1bGUgdGhlIG5leHQgbWVzc2FnZSBldmVudCBhdCB0aGUgZW5kXG4gICAgICAgICAgLy8gb2YgdGhlIHByZWNlZGluZyBvbmUuXG4gICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gSWYgYSBzY2hlZHVsZXIgdGFzayB0aHJvd3MsIGV4aXQgdGhlIGN1cnJlbnQgYnJvd3NlciB0YXNrIHNvIHRoZVxuICAgICAgICAvLyBlcnJvciBjYW4gYmUgb2JzZXJ2ZWQuXG4gICAgICAgIHBvcnQucG9zdE1lc3NhZ2UobnVsbCk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc01lc3NhZ2VMb29wUnVubmluZyA9IGZhbHNlO1xuICAgIH0gLy8gWWllbGRpbmcgdG8gdGhlIGJyb3dzZXIgd2lsbCBnaXZlIGl0IGEgY2hhbmNlIHRvIHBhaW50LCBzbyB3ZSBjYW5cbiAgICAvLyByZXNldCB0aGlzLlxuXG5cbiAgICBuZWVkc1BhaW50ID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgdmFyIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IHBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZTtcblxuICByZXF1ZXN0SG9zdENhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICBpZiAoIWlzTWVzc2FnZUxvb3BSdW5uaW5nKSB7XG4gICAgICBpc01lc3NhZ2VMb29wUnVubmluZyA9IHRydWU7XG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKG51bGwpO1xuICAgIH1cbiAgfTtcblxuICByZXF1ZXN0SG9zdFRpbWVvdXQgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIG1zKSB7XG4gICAgdGFza1RpbWVvdXRJRCA9IF9zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbGxiYWNrKGdldEN1cnJlbnRUaW1lKCkpO1xuICAgIH0sIG1zKTtcbiAgfTtcblxuICBjYW5jZWxIb3N0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBfY2xlYXJUaW1lb3V0KHRhc2tUaW1lb3V0SUQpO1xuXG4gICAgdGFza1RpbWVvdXRJRCA9IC0xO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwdXNoKGhlYXAsIG5vZGUpIHtcbiAgdmFyIGluZGV4ID0gaGVhcC5sZW5ndGg7XG4gIGhlYXAucHVzaChub2RlKTtcbiAgc2lmdFVwKGhlYXAsIG5vZGUsIGluZGV4KTtcbn1cbmZ1bmN0aW9uIHBlZWsoaGVhcCkge1xuICB2YXIgZmlyc3QgPSBoZWFwWzBdO1xuICByZXR1cm4gZmlyc3QgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBmaXJzdDtcbn1cbmZ1bmN0aW9uIHBvcChoZWFwKSB7XG4gIHZhciBmaXJzdCA9IGhlYXBbMF07XG5cbiAgaWYgKGZpcnN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgbGFzdCA9IGhlYXAucG9wKCk7XG5cbiAgICBpZiAobGFzdCAhPT0gZmlyc3QpIHtcbiAgICAgIGhlYXBbMF0gPSBsYXN0O1xuICAgICAgc2lmdERvd24oaGVhcCwgbGFzdCwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNpZnRVcChoZWFwLCBub2RlLCBpKSB7XG4gIHZhciBpbmRleCA9IGk7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChpbmRleCAtIDEpIC8gMik7XG4gICAgdmFyIHBhcmVudCA9IGhlYXBbcGFyZW50SW5kZXhdO1xuXG4gICAgaWYgKHBhcmVudCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmUocGFyZW50LCBub2RlKSA+IDApIHtcbiAgICAgIC8vIFRoZSBwYXJlbnQgaXMgbGFyZ2VyLiBTd2FwIHBvc2l0aW9ucy5cbiAgICAgIGhlYXBbcGFyZW50SW5kZXhdID0gbm9kZTtcbiAgICAgIGhlYXBbaW5kZXhdID0gcGFyZW50O1xuICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHBhcmVudCBpcyBzbWFsbGVyLiBFeGl0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzaWZ0RG93bihoZWFwLCBub2RlLCBpKSB7XG4gIHZhciBpbmRleCA9IGk7XG4gIHZhciBsZW5ndGggPSBoZWFwLmxlbmd0aDtcblxuICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgbGVmdEluZGV4ID0gKGluZGV4ICsgMSkgKiAyIC0gMTtcbiAgICB2YXIgbGVmdCA9IGhlYXBbbGVmdEluZGV4XTtcbiAgICB2YXIgcmlnaHRJbmRleCA9IGxlZnRJbmRleCArIDE7XG4gICAgdmFyIHJpZ2h0ID0gaGVhcFtyaWdodEluZGV4XTsgLy8gSWYgdGhlIGxlZnQgb3IgcmlnaHQgbm9kZSBpcyBzbWFsbGVyLCBzd2FwIHdpdGggdGhlIHNtYWxsZXIgb2YgdGhvc2UuXG5cbiAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmUobGVmdCwgbm9kZSkgPCAwKSB7XG4gICAgICBpZiAocmlnaHQgIT09IHVuZGVmaW5lZCAmJiBjb21wYXJlKHJpZ2h0LCBsZWZ0KSA8IDApIHtcbiAgICAgICAgaGVhcFtpbmRleF0gPSByaWdodDtcbiAgICAgICAgaGVhcFtyaWdodEluZGV4XSA9IG5vZGU7XG4gICAgICAgIGluZGV4ID0gcmlnaHRJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYXBbaW5kZXhdID0gbGVmdDtcbiAgICAgICAgaGVhcFtsZWZ0SW5kZXhdID0gbm9kZTtcbiAgICAgICAgaW5kZXggPSBsZWZ0SW5kZXg7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyaWdodCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmUocmlnaHQsIG5vZGUpIDwgMCkge1xuICAgICAgaGVhcFtpbmRleF0gPSByaWdodDtcbiAgICAgIGhlYXBbcmlnaHRJbmRleF0gPSBub2RlO1xuICAgICAgaW5kZXggPSByaWdodEluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOZWl0aGVyIGNoaWxkIGlzIHNtYWxsZXIuIEV4aXQuXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAvLyBDb21wYXJlIHNvcnQgaW5kZXggZmlyc3QsIHRoZW4gdGFzayBpZC5cbiAgdmFyIGRpZmYgPSBhLnNvcnRJbmRleCAtIGIuc29ydEluZGV4O1xuICByZXR1cm4gZGlmZiAhPT0gMCA/IGRpZmYgOiBhLmlkIC0gYi5pZDtcbn1cblxuLy8gVE9ETzogVXNlIHN5bWJvbHM/XG52YXIgTm9Qcmlvcml0eSA9IDA7XG52YXIgSW1tZWRpYXRlUHJpb3JpdHkgPSAxO1xudmFyIFVzZXJCbG9ja2luZ1ByaW9yaXR5ID0gMjtcbnZhciBOb3JtYWxQcmlvcml0eSA9IDM7XG52YXIgTG93UHJpb3JpdHkgPSA0O1xudmFyIElkbGVQcmlvcml0eSA9IDU7XG5cbnZhciBydW5JZENvdW50ZXIgPSAwO1xudmFyIG1haW5UaHJlYWRJZENvdW50ZXIgPSAwO1xudmFyIHByb2ZpbGluZ1N0YXRlU2l6ZSA9IDQ7XG52YXIgc2hhcmVkUHJvZmlsaW5nQnVmZmVyID0gZW5hYmxlUHJvZmlsaW5nID8gLy8gJEZsb3dGaXhNZSBGbG93IGRvZXNuJ3Qga25vdyBhYm91dCBTaGFyZWRBcnJheUJ1ZmZlclxudHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09PSAnZnVuY3Rpb24nID8gbmV3IFNoYXJlZEFycmF5QnVmZmVyKHByb2ZpbGluZ1N0YXRlU2l6ZSAqIEludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpIDogLy8gJEZsb3dGaXhNZSBGbG93IGRvZXNuJ3Qga25vdyBhYm91dCBBcnJheUJ1ZmZlclxudHlwZW9mIEFycmF5QnVmZmVyID09PSAnZnVuY3Rpb24nID8gbmV3IEFycmF5QnVmZmVyKHByb2ZpbGluZ1N0YXRlU2l6ZSAqIEludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpIDogbnVsbCAvLyBEb24ndCBjcmFzaCB0aGUgaW5pdCBwYXRoIG9uIElFOVxuOiBudWxsO1xudmFyIHByb2ZpbGluZ1N0YXRlID0gZW5hYmxlUHJvZmlsaW5nICYmIHNoYXJlZFByb2ZpbGluZ0J1ZmZlciAhPT0gbnVsbCA/IG5ldyBJbnQzMkFycmF5KHNoYXJlZFByb2ZpbGluZ0J1ZmZlcikgOiBbXTsgLy8gV2UgY2FuJ3QgcmVhZCB0aGlzIGJ1dCBpdCBoZWxwcyBzYXZlIGJ5dGVzIGZvciBudWxsIGNoZWNrc1xuXG52YXIgUFJJT1JJVFkgPSAwO1xudmFyIENVUlJFTlRfVEFTS19JRCA9IDE7XG52YXIgQ1VSUkVOVF9SVU5fSUQgPSAyO1xudmFyIFFVRVVFX1NJWkUgPSAzO1xuXG5pZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gIHByb2ZpbGluZ1N0YXRlW1BSSU9SSVRZXSA9IE5vUHJpb3JpdHk7IC8vIFRoaXMgaXMgbWFpbnRhaW5lZCB3aXRoIGEgY291bnRlciwgYmVjYXVzZSB0aGUgc2l6ZSBvZiB0aGUgcHJpb3JpdHkgcXVldWVcbiAgLy8gYXJyYXkgbWlnaHQgaW5jbHVkZSBjYW5jZWxlZCB0YXNrcy5cblxuICBwcm9maWxpbmdTdGF0ZVtRVUVVRV9TSVpFXSA9IDA7XG4gIHByb2ZpbGluZ1N0YXRlW0NVUlJFTlRfVEFTS19JRF0gPSAwO1xufSAvLyBCeXRlcyBwZXIgZWxlbWVudCBpcyA0XG5cblxudmFyIElOSVRJQUxfRVZFTlRfTE9HX1NJWkUgPSAxMzEwNzI7XG52YXIgTUFYX0VWRU5UX0xPR19TSVpFID0gNTI0Mjg4OyAvLyBFcXVpdmFsZW50IHRvIDIgbWVnYWJ5dGVzXG5cbnZhciBldmVudExvZ1NpemUgPSAwO1xudmFyIGV2ZW50TG9nQnVmZmVyID0gbnVsbDtcbnZhciBldmVudExvZyA9IG51bGw7XG52YXIgZXZlbnRMb2dJbmRleCA9IDA7XG52YXIgVGFza1N0YXJ0RXZlbnQgPSAxO1xudmFyIFRhc2tDb21wbGV0ZUV2ZW50ID0gMjtcbnZhciBUYXNrRXJyb3JFdmVudCA9IDM7XG52YXIgVGFza0NhbmNlbEV2ZW50ID0gNDtcbnZhciBUYXNrUnVuRXZlbnQgPSA1O1xudmFyIFRhc2tZaWVsZEV2ZW50ID0gNjtcbnZhciBTY2hlZHVsZXJTdXNwZW5kRXZlbnQgPSA3O1xudmFyIFNjaGVkdWxlclJlc3VtZUV2ZW50ID0gODtcblxuZnVuY3Rpb24gbG9nRXZlbnQoZW50cmllcykge1xuICBpZiAoZXZlbnRMb2cgIT09IG51bGwpIHtcbiAgICB2YXIgb2Zmc2V0ID0gZXZlbnRMb2dJbmRleDtcbiAgICBldmVudExvZ0luZGV4ICs9IGVudHJpZXMubGVuZ3RoO1xuXG4gICAgaWYgKGV2ZW50TG9nSW5kZXggKyAxID4gZXZlbnRMb2dTaXplKSB7XG4gICAgICBldmVudExvZ1NpemUgKj0gMjtcblxuICAgICAgaWYgKGV2ZW50TG9nU2l6ZSA+IE1BWF9FVkVOVF9MT0dfU0laRSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiU2NoZWR1bGVyIFByb2ZpbGluZzogRXZlbnQgbG9nIGV4Y2VlZGVkIG1heGltdW0gc2l6ZS4gRG9uJ3QgXCIgKyAnZm9yZ2V0IHRvIGNhbGwgYHN0b3BMb2dnaW5nUHJvZmlsaW5nRXZlbnRzKClgLicpO1xuICAgICAgICBzdG9wTG9nZ2luZ1Byb2ZpbGluZ0V2ZW50cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdFdmVudExvZyA9IG5ldyBJbnQzMkFycmF5KGV2ZW50TG9nU2l6ZSAqIDQpO1xuICAgICAgbmV3RXZlbnRMb2cuc2V0KGV2ZW50TG9nKTtcbiAgICAgIGV2ZW50TG9nQnVmZmVyID0gbmV3RXZlbnRMb2cuYnVmZmVyO1xuICAgICAgZXZlbnRMb2cgPSBuZXdFdmVudExvZztcbiAgICB9XG5cbiAgICBldmVudExvZy5zZXQoZW50cmllcywgb2Zmc2V0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdGFydExvZ2dpbmdQcm9maWxpbmdFdmVudHMoKSB7XG4gIGV2ZW50TG9nU2l6ZSA9IElOSVRJQUxfRVZFTlRfTE9HX1NJWkU7XG4gIGV2ZW50TG9nQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGV2ZW50TG9nU2l6ZSAqIDQpO1xuICBldmVudExvZyA9IG5ldyBJbnQzMkFycmF5KGV2ZW50TG9nQnVmZmVyKTtcbiAgZXZlbnRMb2dJbmRleCA9IDA7XG59XG5mdW5jdGlvbiBzdG9wTG9nZ2luZ1Byb2ZpbGluZ0V2ZW50cygpIHtcbiAgdmFyIGJ1ZmZlciA9IGV2ZW50TG9nQnVmZmVyO1xuICBldmVudExvZ1NpemUgPSAwO1xuICBldmVudExvZ0J1ZmZlciA9IG51bGw7XG4gIGV2ZW50TG9nID0gbnVsbDtcbiAgZXZlbnRMb2dJbmRleCA9IDA7XG4gIHJldHVybiBidWZmZXI7XG59XG5mdW5jdGlvbiBtYXJrVGFza1N0YXJ0KHRhc2ssIG1zKSB7XG4gIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICBwcm9maWxpbmdTdGF0ZVtRVUVVRV9TSVpFXSsrO1xuXG4gICAgaWYgKGV2ZW50TG9nICE9PSBudWxsKSB7XG4gICAgICAvLyBwZXJmb3JtYW5jZS5ub3cgcmV0dXJucyBhIGZsb2F0LCByZXByZXNlbnRpbmcgbWlsbGlzZWNvbmRzLiBXaGVuIHRoZVxuICAgICAgLy8gZXZlbnQgaXMgbG9nZ2VkLCBpdCdzIGNvZXJjZWQgdG8gYW4gaW50LiBDb252ZXJ0IHRvIG1pY3Jvc2Vjb25kcyB0b1xuICAgICAgLy8gbWFpbnRhaW4gZXh0cmEgZGVncmVlcyBvZiBwcmVjaXNpb24uXG4gICAgICBsb2dFdmVudChbVGFza1N0YXJ0RXZlbnQsIG1zICogMTAwMCwgdGFzay5pZCwgdGFzay5wcmlvcml0eUxldmVsXSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBtYXJrVGFza0NvbXBsZXRlZCh0YXNrLCBtcykge1xuICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgcHJvZmlsaW5nU3RhdGVbUFJJT1JJVFldID0gTm9Qcmlvcml0eTtcbiAgICBwcm9maWxpbmdTdGF0ZVtDVVJSRU5UX1RBU0tfSURdID0gMDtcbiAgICBwcm9maWxpbmdTdGF0ZVtRVUVVRV9TSVpFXS0tO1xuXG4gICAgaWYgKGV2ZW50TG9nICE9PSBudWxsKSB7XG4gICAgICBsb2dFdmVudChbVGFza0NvbXBsZXRlRXZlbnQsIG1zICogMTAwMCwgdGFzay5pZF0pO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gbWFya1Rhc2tDYW5jZWxlZCh0YXNrLCBtcykge1xuICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgcHJvZmlsaW5nU3RhdGVbUVVFVUVfU0laRV0tLTtcblxuICAgIGlmIChldmVudExvZyAhPT0gbnVsbCkge1xuICAgICAgbG9nRXZlbnQoW1Rhc2tDYW5jZWxFdmVudCwgbXMgKiAxMDAwLCB0YXNrLmlkXSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBtYXJrVGFza0Vycm9yZWQodGFzaywgbXMpIHtcbiAgaWYgKGVuYWJsZVByb2ZpbGluZykge1xuICAgIHByb2ZpbGluZ1N0YXRlW1BSSU9SSVRZXSA9IE5vUHJpb3JpdHk7XG4gICAgcHJvZmlsaW5nU3RhdGVbQ1VSUkVOVF9UQVNLX0lEXSA9IDA7XG4gICAgcHJvZmlsaW5nU3RhdGVbUVVFVUVfU0laRV0tLTtcblxuICAgIGlmIChldmVudExvZyAhPT0gbnVsbCkge1xuICAgICAgbG9nRXZlbnQoW1Rhc2tFcnJvckV2ZW50LCBtcyAqIDEwMDAsIHRhc2suaWRdKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIG1hcmtUYXNrUnVuKHRhc2ssIG1zKSB7XG4gIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICBydW5JZENvdW50ZXIrKztcbiAgICBwcm9maWxpbmdTdGF0ZVtQUklPUklUWV0gPSB0YXNrLnByaW9yaXR5TGV2ZWw7XG4gICAgcHJvZmlsaW5nU3RhdGVbQ1VSUkVOVF9UQVNLX0lEXSA9IHRhc2suaWQ7XG4gICAgcHJvZmlsaW5nU3RhdGVbQ1VSUkVOVF9SVU5fSURdID0gcnVuSWRDb3VudGVyO1xuXG4gICAgaWYgKGV2ZW50TG9nICE9PSBudWxsKSB7XG4gICAgICBsb2dFdmVudChbVGFza1J1bkV2ZW50LCBtcyAqIDEwMDAsIHRhc2suaWQsIHJ1bklkQ291bnRlcl0pO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gbWFya1Rhc2tZaWVsZCh0YXNrLCBtcykge1xuICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgcHJvZmlsaW5nU3RhdGVbUFJJT1JJVFldID0gTm9Qcmlvcml0eTtcbiAgICBwcm9maWxpbmdTdGF0ZVtDVVJSRU5UX1RBU0tfSURdID0gMDtcbiAgICBwcm9maWxpbmdTdGF0ZVtDVVJSRU5UX1JVTl9JRF0gPSAwO1xuXG4gICAgaWYgKGV2ZW50TG9nICE9PSBudWxsKSB7XG4gICAgICBsb2dFdmVudChbVGFza1lpZWxkRXZlbnQsIG1zICogMTAwMCwgdGFzay5pZCwgcnVuSWRDb3VudGVyXSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBtYXJrU2NoZWR1bGVyU3VzcGVuZGVkKG1zKSB7XG4gIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICBtYWluVGhyZWFkSWRDb3VudGVyKys7XG5cbiAgICBpZiAoZXZlbnRMb2cgIT09IG51bGwpIHtcbiAgICAgIGxvZ0V2ZW50KFtTY2hlZHVsZXJTdXNwZW5kRXZlbnQsIG1zICogMTAwMCwgbWFpblRocmVhZElkQ291bnRlcl0pO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gbWFya1NjaGVkdWxlclVuc3VzcGVuZGVkKG1zKSB7XG4gIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICBpZiAoZXZlbnRMb2cgIT09IG51bGwpIHtcbiAgICAgIGxvZ0V2ZW50KFtTY2hlZHVsZXJSZXN1bWVFdmVudCwgbXMgKiAxMDAwLCBtYWluVGhyZWFkSWRDb3VudGVyXSk7XG4gICAgfVxuICB9XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuLy8gTWF0aC5wb3coMiwgMzApIC0gMVxuLy8gMGIxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTFcblxudmFyIG1heFNpZ25lZDMxQml0SW50ID0gMTA3Mzc0MTgyMzsgLy8gVGltZXMgb3V0IGltbWVkaWF0ZWx5XG5cbnZhciBJTU1FRElBVEVfUFJJT1JJVFlfVElNRU9VVCA9IC0xOyAvLyBFdmVudHVhbGx5IHRpbWVzIG91dFxuXG52YXIgVVNFUl9CTE9DS0lOR19QUklPUklUWSA9IDI1MDtcbnZhciBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVCA9IDUwMDA7XG52YXIgTE9XX1BSSU9SSVRZX1RJTUVPVVQgPSAxMDAwMDsgLy8gTmV2ZXIgdGltZXMgb3V0XG5cbnZhciBJRExFX1BSSU9SSVRZID0gbWF4U2lnbmVkMzFCaXRJbnQ7IC8vIFRhc2tzIGFyZSBzdG9yZWQgb24gYSBtaW4gaGVhcFxuXG52YXIgdGFza1F1ZXVlID0gW107XG52YXIgdGltZXJRdWV1ZSA9IFtdOyAvLyBJbmNyZW1lbnRpbmcgaWQgY291bnRlci4gVXNlZCB0byBtYWludGFpbiBpbnNlcnRpb24gb3JkZXIuXG5cbnZhciB0YXNrSWRDb3VudGVyID0gMTsgLy8gUGF1c2luZyB0aGUgc2NoZWR1bGVyIGlzIHVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuXG52YXIgaXNTY2hlZHVsZXJQYXVzZWQgPSBmYWxzZTtcbnZhciBjdXJyZW50VGFzayA9IG51bGw7XG52YXIgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTsgLy8gVGhpcyBpcyBzZXQgd2hpbGUgcGVyZm9ybWluZyB3b3JrLCB0byBwcmV2ZW50IHJlLWVudHJhbmN5LlxuXG52YXIgaXNQZXJmb3JtaW5nV29yayA9IGZhbHNlO1xudmFyIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gZmFsc2U7XG52YXIgaXNIb3N0VGltZW91dFNjaGVkdWxlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBhZHZhbmNlVGltZXJzKGN1cnJlbnRUaW1lKSB7XG4gIC8vIENoZWNrIGZvciB0YXNrcyB0aGF0IGFyZSBubyBsb25nZXIgZGVsYXllZCBhbmQgYWRkIHRoZW0gdG8gdGhlIHF1ZXVlLlxuICB2YXIgdGltZXIgPSBwZWVrKHRpbWVyUXVldWUpO1xuXG4gIHdoaWxlICh0aW1lciAhPT0gbnVsbCkge1xuICAgIGlmICh0aW1lci5jYWxsYmFjayA9PT0gbnVsbCkge1xuICAgICAgLy8gVGltZXIgd2FzIGNhbmNlbGxlZC5cbiAgICAgIHBvcCh0aW1lclF1ZXVlKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVyLnN0YXJ0VGltZSA8PSBjdXJyZW50VGltZSkge1xuICAgICAgLy8gVGltZXIgZmlyZWQuIFRyYW5zZmVyIHRvIHRoZSB0YXNrIHF1ZXVlLlxuICAgICAgcG9wKHRpbWVyUXVldWUpO1xuICAgICAgdGltZXIuc29ydEluZGV4ID0gdGltZXIuZXhwaXJhdGlvblRpbWU7XG4gICAgICBwdXNoKHRhc2tRdWV1ZSwgdGltZXIpO1xuXG4gICAgICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgICAgIG1hcmtUYXNrU3RhcnQodGltZXIsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgdGltZXIuaXNRdWV1ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZW1haW5pbmcgdGltZXJzIGFyZSBwZW5kaW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRpbWVyID0gcGVlayh0aW1lclF1ZXVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVUaW1lb3V0KGN1cnJlbnRUaW1lKSB7XG4gIGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQgPSBmYWxzZTtcbiAgYWR2YW5jZVRpbWVycyhjdXJyZW50VGltZSk7XG5cbiAgaWYgKCFpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCkge1xuICAgIGlmIChwZWVrKHRhc2tRdWV1ZSkgIT09IG51bGwpIHtcbiAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZpcnN0VGltZXIgPSBwZWVrKHRpbWVyUXVldWUpO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICByZXF1ZXN0SG9zdFRpbWVvdXQoaGFuZGxlVGltZW91dCwgZmlyc3RUaW1lci5zdGFydFRpbWUgLSBjdXJyZW50VGltZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoV29yayhoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSkge1xuICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgbWFya1NjaGVkdWxlclVuc3VzcGVuZGVkKGluaXRpYWxUaW1lKTtcbiAgfSAvLyBXZSdsbCBuZWVkIGEgaG9zdCBjYWxsYmFjayB0aGUgbmV4dCB0aW1lIHdvcmsgaXMgc2NoZWR1bGVkLlxuXG5cbiAgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSBmYWxzZTtcblxuICBpZiAoaXNIb3N0VGltZW91dFNjaGVkdWxlZCkge1xuICAgIC8vIFdlIHNjaGVkdWxlZCBhIHRpbWVvdXQgYnV0IGl0J3Mgbm8gbG9uZ2VyIG5lZWRlZC4gQ2FuY2VsIGl0LlxuICAgIGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBjYW5jZWxIb3N0VGltZW91dCgpO1xuICB9XG5cbiAgaXNQZXJmb3JtaW5nV29yayA9IHRydWU7XG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcblxuICB0cnkge1xuICAgIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB3b3JrTG9vcChoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoY3VycmVudFRhc2sgIT09IG51bGwpIHtcbiAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBnZXRDdXJyZW50VGltZSgpO1xuICAgICAgICAgIG1hcmtUYXNrRXJyb3JlZChjdXJyZW50VGFzaywgY3VycmVudFRpbWUpO1xuICAgICAgICAgIGN1cnJlbnRUYXNrLmlzUXVldWVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gY2F0Y2ggaW4gcHJvZCBjb2RlcGF0aC5cbiAgICAgIHJldHVybiB3b3JrTG9vcChoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRUYXNrID0gbnVsbDtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgICBpc1BlcmZvcm1pbmdXb3JrID0gZmFsc2U7XG5cbiAgICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgICB2YXIgX2N1cnJlbnRUaW1lID0gZ2V0Q3VycmVudFRpbWUoKTtcblxuICAgICAgbWFya1NjaGVkdWxlclN1c3BlbmRlZChfY3VycmVudFRpbWUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB3b3JrTG9vcChoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSkge1xuICB2YXIgY3VycmVudFRpbWUgPSBpbml0aWFsVGltZTtcbiAgYWR2YW5jZVRpbWVycyhjdXJyZW50VGltZSk7XG4gIGN1cnJlbnRUYXNrID0gcGVlayh0YXNrUXVldWUpO1xuXG4gIHdoaWxlIChjdXJyZW50VGFzayAhPT0gbnVsbCAmJiAhKGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyAmJiBpc1NjaGVkdWxlclBhdXNlZCkpIHtcbiAgICBpZiAoY3VycmVudFRhc2suZXhwaXJhdGlvblRpbWUgPiBjdXJyZW50VGltZSAmJiAoIWhhc1RpbWVSZW1haW5pbmcgfHwgc2hvdWxkWWllbGRUb0hvc3QoKSkpIHtcbiAgICAgIC8vIFRoaXMgY3VycmVudFRhc2sgaGFzbid0IGV4cGlyZWQsIGFuZCB3ZSd2ZSByZWFjaGVkIHRoZSBkZWFkbGluZS5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBjYWxsYmFjayA9IGN1cnJlbnRUYXNrLmNhbGxiYWNrO1xuXG4gICAgaWYgKGNhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICBjdXJyZW50VGFzay5jYWxsYmFjayA9IG51bGw7XG4gICAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRUYXNrLnByaW9yaXR5TGV2ZWw7XG4gICAgICB2YXIgZGlkVXNlckNhbGxiYWNrVGltZW91dCA9IGN1cnJlbnRUYXNrLmV4cGlyYXRpb25UaW1lIDw9IGN1cnJlbnRUaW1lO1xuICAgICAgbWFya1Rhc2tSdW4oY3VycmVudFRhc2ssIGN1cnJlbnRUaW1lKTtcbiAgICAgIHZhciBjb250aW51YXRpb25DYWxsYmFjayA9IGNhbGxiYWNrKGRpZFVzZXJDYWxsYmFja1RpbWVvdXQpO1xuICAgICAgY3VycmVudFRpbWUgPSBnZXRDdXJyZW50VGltZSgpO1xuXG4gICAgICBpZiAodHlwZW9mIGNvbnRpbnVhdGlvbkNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGN1cnJlbnRUYXNrLmNhbGxiYWNrID0gY29udGludWF0aW9uQ2FsbGJhY2s7XG4gICAgICAgIG1hcmtUYXNrWWllbGQoY3VycmVudFRhc2ssIGN1cnJlbnRUaW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbmFibGVQcm9maWxpbmcpIHtcbiAgICAgICAgICBtYXJrVGFza0NvbXBsZXRlZChjdXJyZW50VGFzaywgY3VycmVudFRpbWUpO1xuICAgICAgICAgIGN1cnJlbnRUYXNrLmlzUXVldWVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFRhc2sgPT09IHBlZWsodGFza1F1ZXVlKSkge1xuICAgICAgICAgIHBvcCh0YXNrUXVldWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFkdmFuY2VUaW1lcnMoY3VycmVudFRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3AodGFza1F1ZXVlKTtcbiAgICB9XG5cbiAgICBjdXJyZW50VGFzayA9IHBlZWsodGFza1F1ZXVlKTtcbiAgfSAvLyBSZXR1cm4gd2hldGhlciB0aGVyZSdzIGFkZGl0aW9uYWwgd29ya1xuXG5cbiAgaWYgKGN1cnJlbnRUYXNrICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGZpcnN0VGltZXIgPSBwZWVrKHRpbWVyUXVldWUpO1xuXG4gICAgaWYgKGZpcnN0VGltZXIgIT09IG51bGwpIHtcbiAgICAgIHJlcXVlc3RIb3N0VGltZW91dChoYW5kbGVUaW1lb3V0LCBmaXJzdFRpbWVyLnN0YXJ0VGltZSAtIGN1cnJlbnRUaW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfcnVuV2l0aFByaW9yaXR5KHByaW9yaXR5TGV2ZWwsIGV2ZW50SGFuZGxlcikge1xuICBzd2l0Y2ggKHByaW9yaXR5TGV2ZWwpIHtcbiAgICBjYXNlIEltbWVkaWF0ZVByaW9yaXR5OlxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgY2FzZSBOb3JtYWxQcmlvcml0eTpcbiAgICBjYXNlIExvd1ByaW9yaXR5OlxuICAgIGNhc2UgSWRsZVByaW9yaXR5OlxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcHJpb3JpdHlMZXZlbCA9IE5vcm1hbFByaW9yaXR5O1xuICB9XG5cbiAgdmFyIHByZXZpb3VzUHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByaW9yaXR5TGV2ZWw7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZXZlbnRIYW5kbGVyKCk7XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfbmV4dChldmVudEhhbmRsZXIpIHtcbiAgdmFyIHByaW9yaXR5TGV2ZWw7XG5cbiAgc3dpdGNoIChjdXJyZW50UHJpb3JpdHlMZXZlbCkge1xuICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgY2FzZSBVc2VyQmxvY2tpbmdQcmlvcml0eTpcbiAgICBjYXNlIE5vcm1hbFByaW9yaXR5OlxuICAgICAgLy8gU2hpZnQgZG93biB0byBub3JtYWwgcHJpb3JpdHlcbiAgICAgIHByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIEFueXRoaW5nIGxvd2VyIHRoYW4gbm9ybWFsIHByaW9yaXR5IHNob3VsZCByZW1haW4gYXQgdGhlIGN1cnJlbnQgbGV2ZWwuXG4gICAgICBwcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmlvcml0eUxldmVsO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGV2ZW50SGFuZGxlcigpO1xuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3dyYXBDYWxsYmFjayhjYWxsYmFjaykge1xuICB2YXIgcGFyZW50UHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoaXMgaXMgYSBmb3JrIG9mIHJ1bldpdGhQcmlvcml0eSwgaW5saW5lZCBmb3IgcGVyZm9ybWFuY2UuXG4gICAgdmFyIHByZXZpb3VzUHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcGFyZW50UHJpb3JpdHlMZXZlbDtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiB0aW1lb3V0Rm9yUHJpb3JpdHlMZXZlbChwcmlvcml0eUxldmVsKSB7XG4gIHN3aXRjaCAocHJpb3JpdHlMZXZlbCkge1xuICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgICByZXR1cm4gSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQ7XG5cbiAgICBjYXNlIFVzZXJCbG9ja2luZ1ByaW9yaXR5OlxuICAgICAgcmV0dXJuIFVTRVJfQkxPQ0tJTkdfUFJJT1JJVFk7XG5cbiAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgIHJldHVybiBJRExFX1BSSU9SSVRZO1xuXG4gICAgY2FzZSBMb3dQcmlvcml0eTpcbiAgICAgIHJldHVybiBMT1dfUFJJT1JJVFlfVElNRU9VVDtcblxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVDtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKHByaW9yaXR5TGV2ZWwsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gIHZhciBjdXJyZW50VGltZSA9IGdldEN1cnJlbnRUaW1lKCk7XG4gIHZhciBzdGFydFRpbWU7XG4gIHZhciB0aW1lb3V0O1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucyAhPT0gbnVsbCkge1xuICAgIHZhciBkZWxheSA9IG9wdGlvbnMuZGVsYXk7XG5cbiAgICBpZiAodHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyAmJiBkZWxheSA+IDApIHtcbiAgICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lICsgZGVsYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgIH1cblxuICAgIHRpbWVvdXQgPSB0eXBlb2Ygb3B0aW9ucy50aW1lb3V0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMudGltZW91dCA6IHRpbWVvdXRGb3JQcmlvcml0eUxldmVsKHByaW9yaXR5TGV2ZWwpO1xuICB9IGVsc2Uge1xuICAgIHRpbWVvdXQgPSB0aW1lb3V0Rm9yUHJpb3JpdHlMZXZlbChwcmlvcml0eUxldmVsKTtcbiAgICBzdGFydFRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIHZhciBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIHRpbWVvdXQ7XG4gIHZhciBuZXdUYXNrID0ge1xuICAgIGlkOiB0YXNrSWRDb3VudGVyKyssXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIHByaW9yaXR5TGV2ZWw6IHByaW9yaXR5TGV2ZWwsXG4gICAgc3RhcnRUaW1lOiBzdGFydFRpbWUsXG4gICAgZXhwaXJhdGlvblRpbWU6IGV4cGlyYXRpb25UaW1lLFxuICAgIHNvcnRJbmRleDogLTFcbiAgfTtcblxuICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgbmV3VGFzay5pc1F1ZXVlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHN0YXJ0VGltZSA+IGN1cnJlbnRUaW1lKSB7XG4gICAgLy8gVGhpcyBpcyBhIGRlbGF5ZWQgdGFzay5cbiAgICBuZXdUYXNrLnNvcnRJbmRleCA9IHN0YXJ0VGltZTtcbiAgICBwdXNoKHRpbWVyUXVldWUsIG5ld1Rhc2spO1xuXG4gICAgaWYgKHBlZWsodGFza1F1ZXVlKSA9PT0gbnVsbCAmJiBuZXdUYXNrID09PSBwZWVrKHRpbWVyUXVldWUpKSB7XG4gICAgICAvLyBBbGwgdGFza3MgYXJlIGRlbGF5ZWQsIGFuZCB0aGlzIGlzIHRoZSB0YXNrIHdpdGggdGhlIGVhcmxpZXN0IGRlbGF5LlxuICAgICAgaWYgKGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQpIHtcbiAgICAgICAgLy8gQ2FuY2VsIGFuIGV4aXN0aW5nIHRpbWVvdXQuXG4gICAgICAgIGNhbmNlbEhvc3RUaW1lb3V0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc0hvc3RUaW1lb3V0U2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIH0gLy8gU2NoZWR1bGUgYSB0aW1lb3V0LlxuXG5cbiAgICAgIHJlcXVlc3RIb3N0VGltZW91dChoYW5kbGVUaW1lb3V0LCBzdGFydFRpbWUgLSBjdXJyZW50VGltZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5ld1Rhc2suc29ydEluZGV4ID0gZXhwaXJhdGlvblRpbWU7XG4gICAgcHVzaCh0YXNrUXVldWUsIG5ld1Rhc2spO1xuXG4gICAgaWYgKGVuYWJsZVByb2ZpbGluZykge1xuICAgICAgbWFya1Rhc2tTdGFydChuZXdUYXNrLCBjdXJyZW50VGltZSk7XG4gICAgICBuZXdUYXNrLmlzUXVldWVkID0gdHJ1ZTtcbiAgICB9IC8vIFNjaGVkdWxlIGEgaG9zdCBjYWxsYmFjaywgaWYgbmVlZGVkLiBJZiB3ZSdyZSBhbHJlYWR5IHBlcmZvcm1pbmcgd29yayxcbiAgICAvLyB3YWl0IHVudGlsIHRoZSBuZXh0IHRpbWUgd2UgeWllbGQuXG5cblxuICAgIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgJiYgIWlzUGVyZm9ybWluZ1dvcmspIHtcbiAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3VGFzaztcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfcGF1c2VFeGVjdXRpb24oKSB7XG4gIGlzU2NoZWR1bGVyUGF1c2VkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfY29udGludWVFeGVjdXRpb24oKSB7XG4gIGlzU2NoZWR1bGVyUGF1c2VkID0gZmFsc2U7XG5cbiAgaWYgKCFpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCAmJiAhaXNQZXJmb3JtaW5nV29yaykge1xuICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICByZXF1ZXN0SG9zdENhbGxiYWNrKGZsdXNoV29yayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGUoKSB7XG4gIHJldHVybiBwZWVrKHRhc2tRdWV1ZSk7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrKHRhc2spIHtcbiAgaWYgKGVuYWJsZVByb2ZpbGluZykge1xuICAgIGlmICh0YXNrLmlzUXVldWVkKSB7XG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBnZXRDdXJyZW50VGltZSgpO1xuICAgICAgbWFya1Rhc2tDYW5jZWxlZCh0YXNrLCBjdXJyZW50VGltZSk7XG4gICAgICB0YXNrLmlzUXVldWVkID0gZmFsc2U7XG4gICAgfVxuICB9IC8vIE51bGwgb3V0IHRoZSBjYWxsYmFjayB0byBpbmRpY2F0ZSB0aGUgdGFzayBoYXMgYmVlbiBjYW5jZWxlZC4gKENhbid0XG4gIC8vIHJlbW92ZSBmcm9tIHRoZSBxdWV1ZSBiZWNhdXNlIHlvdSBjYW4ndCByZW1vdmUgYXJiaXRyYXJ5IG5vZGVzIGZyb20gYW5cbiAgLy8gYXJyYXkgYmFzZWQgaGVhcCwgb25seSB0aGUgZmlyc3Qgb25lLilcblxuXG4gIHRhc2suY2FsbGJhY2sgPSBudWxsO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCgpIHtcbiAgcmV0dXJuIGN1cnJlbnRQcmlvcml0eUxldmVsO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9zaG91bGRZaWVsZCgpIHtcbiAgdmFyIGN1cnJlbnRUaW1lID0gZ2V0Q3VycmVudFRpbWUoKTtcbiAgYWR2YW5jZVRpbWVycyhjdXJyZW50VGltZSk7XG4gIHZhciBmaXJzdFRhc2sgPSBwZWVrKHRhc2tRdWV1ZSk7XG4gIHJldHVybiBmaXJzdFRhc2sgIT09IGN1cnJlbnRUYXNrICYmIGN1cnJlbnRUYXNrICE9PSBudWxsICYmIGZpcnN0VGFzayAhPT0gbnVsbCAmJiBmaXJzdFRhc2suY2FsbGJhY2sgIT09IG51bGwgJiYgZmlyc3RUYXNrLnN0YXJ0VGltZSA8PSBjdXJyZW50VGltZSAmJiBmaXJzdFRhc2suZXhwaXJhdGlvblRpbWUgPCBjdXJyZW50VGFzay5leHBpcmF0aW9uVGltZSB8fCBzaG91bGRZaWVsZFRvSG9zdCgpO1xufVxuXG52YXIgdW5zdGFibGVfcmVxdWVzdFBhaW50ID0gcmVxdWVzdFBhaW50O1xudmFyIHVuc3RhYmxlX1Byb2ZpbGluZyA9IGVuYWJsZVByb2ZpbGluZyA/IHtcbiAgc3RhcnRMb2dnaW5nUHJvZmlsaW5nRXZlbnRzOiBzdGFydExvZ2dpbmdQcm9maWxpbmdFdmVudHMsXG4gIHN0b3BMb2dnaW5nUHJvZmlsaW5nRXZlbnRzOiBzdG9wTG9nZ2luZ1Byb2ZpbGluZ0V2ZW50cyxcbiAgc2hhcmVkUHJvZmlsaW5nQnVmZmVyOiBzaGFyZWRQcm9maWxpbmdCdWZmZXJcbn0gOiBudWxsO1xuXG5cblxudmFyIFNjaGVkdWxlciA9IE9iamVjdC5mcmVlemUoe1xuXHR1bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eTogSW1tZWRpYXRlUHJpb3JpdHksXG5cdHVuc3RhYmxlX1VzZXJCbG9ja2luZ1ByaW9yaXR5OiBVc2VyQmxvY2tpbmdQcmlvcml0eSxcblx0dW5zdGFibGVfTm9ybWFsUHJpb3JpdHk6IE5vcm1hbFByaW9yaXR5LFxuXHR1bnN0YWJsZV9JZGxlUHJpb3JpdHk6IElkbGVQcmlvcml0eSxcblx0dW5zdGFibGVfTG93UHJpb3JpdHk6IExvd1ByaW9yaXR5LFxuXHR1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHk6IHVuc3RhYmxlX3J1bldpdGhQcmlvcml0eSxcblx0dW5zdGFibGVfbmV4dDogdW5zdGFibGVfbmV4dCxcblx0dW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjazogdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayxcblx0dW5zdGFibGVfY2FuY2VsQ2FsbGJhY2s6IHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrLFxuXHR1bnN0YWJsZV93cmFwQ2FsbGJhY2s6IHVuc3RhYmxlX3dyYXBDYWxsYmFjayxcblx0dW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWw6IHVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsLFxuXHR1bnN0YWJsZV9zaG91bGRZaWVsZDogdW5zdGFibGVfc2hvdWxkWWllbGQsXG5cdHVuc3RhYmxlX3JlcXVlc3RQYWludDogdW5zdGFibGVfcmVxdWVzdFBhaW50LFxuXHR1bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbjogdW5zdGFibGVfY29udGludWVFeGVjdXRpb24sXG5cdHVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uOiB1bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbixcblx0dW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGU6IHVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlLFxuXHRnZXQgdW5zdGFibGVfbm93ICgpIHsgcmV0dXJuIGdldEN1cnJlbnRUaW1lOyB9LFxuXHRnZXQgdW5zdGFibGVfZm9yY2VGcmFtZVJhdGUgKCkgeyByZXR1cm4gZm9yY2VGcmFtZVJhdGU7IH0sXG5cdHVuc3RhYmxlX1Byb2ZpbGluZzogdW5zdGFibGVfUHJvZmlsaW5nXG59KTtcblxuLy8gSGVscHMgaWRlbnRpZnkgc2lkZSBlZmZlY3RzIGluIHJlbmRlci1waGFzZSBsaWZlY3ljbGUgaG9va3MgYW5kIHNldFN0YXRlXG4vLyByZWR1Y2VycyBieSBkb3VibGUgaW52b2tpbmcgdGhlbSBpbiBTdHJpY3QgTW9kZS5cblxuIC8vIFRvIHByZXNlcnZlIHRoZSBcIlBhdXNlIG9uIGNhdWdodCBleGNlcHRpb25zXCIgYmVoYXZpb3Igb2YgdGhlIGRlYnVnZ2VyLCB3ZVxuLy8gcmVwbGF5IHRoZSBiZWdpbiBwaGFzZSBvZiBhIGZhaWxlZCBjb21wb25lbnQgaW5zaWRlIGludm9rZUd1YXJkZWRDYWxsYmFjay5cblxuIC8vIFdhcm4gYWJvdXQgZGVwcmVjYXRlZCwgYXN5bmMtdW5zYWZlIGxpZmVjeWNsZXM7IHJlbGF0ZXMgdG8gUkZDICM2OlxuXG4gLy8gR2F0aGVyIGFkdmFuY2VkIHRpbWluZyBtZXRyaWNzIGZvciBQcm9maWxlciBzdWJ0cmVlcy5cblxuIC8vIFRyYWNlIHdoaWNoIGludGVyYWN0aW9ucyB0cmlnZ2VyIGVhY2ggY29tbWl0LlxuXG52YXIgZW5hYmxlU2NoZWR1bGVyVHJhY2luZyA9IHRydWU7IC8vIFNTUiBleHBlcmltZW50c1xuXG5cbiAvLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cblxuIC8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG4gLy8gRGlzYWJsZSBqYXZhc2NyaXB0OiBVUkwgc3RyaW5ncyBpbiBocmVmIGZvciBYU1MgcHJvdGVjdGlvbi5cblxuIC8vIFJlYWN0IEZpcmU6IHByZXZlbnQgdGhlIHZhbHVlIGFuZCBjaGVja2VkIGF0dHJpYnV0ZXMgZnJvbSBzeW5jaW5nXG4vLyB3aXRoIHRoZWlyIHJlbGF0ZWQgRE9NIHByb3BlcnRpZXNcblxuIC8vIFRoZXNlIEFQSXMgd2lsbCBubyBsb25nZXIgYmUgXCJ1bnN0YWJsZVwiIGluIHRoZSB1cGNvbWluZyAxNi43IHJlbGVhc2UsXG4vLyBDb250cm9sIHRoaXMgYmVoYXZpb3Igd2l0aCBhIGZsYWcgdG8gc3VwcG9ydCAxNi42IG1pbm9yIHJlbGVhc2VzIGluIHRoZSBtZWFud2hpbGUuXG5cbnZhciBleHBvc2VDb25jdXJyZW50TW9kZUFQSXMgPSBmYWxzZTtcbiAvLyBFeHBlcmltZW50YWwgUmVhY3QgRmxhcmUgZXZlbnQgc3lzdGVtIGFuZCBldmVudCBjb21wb25lbnRzIHN1cHBvcnQuXG5cbnZhciBlbmFibGVGbGFyZUFQSSA9IGZhbHNlOyAvLyBFeHBlcmltZW50YWwgSG9zdCBDb21wb25lbnQgc3VwcG9ydC5cblxudmFyIGVuYWJsZUZ1bmRhbWVudGFsQVBJID0gZmFsc2U7IC8vIEV4cGVyaW1lbnRhbCBTY29wZSBzdXBwb3J0LlxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gTmV3IEFQSSBmb3IgSlNYIHRyYW5zZm9ybXMgdG8gdGFyZ2V0IC0gaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9wdWxsLzEwN1xuXG52YXIgZW5hYmxlSlNYVHJhbnNmb3JtQVBJID0gZmFsc2U7IC8vIFdlIHdpbGwgZW5mb3JjZSBtb2NraW5nIHNjaGVkdWxlciB3aXRoIHNjaGVkdWxlci91bnN0YWJsZV9tb2NrIGF0IHNvbWUgcG9pbnQuICh2MTc/KVxuLy8gVGlsbCB0aGVuLCB3ZSB3YXJuIGFib3V0IHRoZSBtaXNzaW5nIG1vY2ssIGJ1dCBzdGlsbCBmYWxsYmFjayB0byBhIGxlZ2FjeSBtb2RlIGNvbXBhdGlibGUgdmVyc2lvblxuXG4gLy8gRm9yIHRlc3RzLCB3ZSBmbHVzaCBzdXNwZW5zZSBmYWxsYmFja3MgaW4gYW4gYWN0IHNjb3BlO1xuLy8gKmV4Y2VwdCogaW4gc29tZSBvZiBvdXIgb3duIHRlc3RzLCB3aGVyZSB3ZSB0ZXN0IGluY3JlbWVudGFsIGxvYWRpbmcgc3RhdGVzLlxuXG4gLy8gQWRkIGEgY2FsbGJhY2sgcHJvcGVydHkgdG8gc3VzcGVuc2UgdG8gbm90aWZ5IHdoaWNoIHByb21pc2VzIGFyZSBjdXJyZW50bHlcbi8vIGluIHRoZSB1cGRhdGUgcXVldWUuIFRoaXMgYWxsb3dzIHJlcG9ydGluZyBhbmQgdHJhY2luZyBvZiB3aGF0IGlzIGNhdXNpbmdcbi8vIHRoZSB1c2VyIHRvIHNlZSBhIGxvYWRpbmcgc3RhdGUuXG4vLyBBbHNvIGFsbG93cyBoeWRyYXRpb24gY2FsbGJhY2tzIHRvIGZpcmUgd2hlbiBhIGRlaHlkcmF0ZWQgYm91bmRhcnkgZ2V0c1xuLy8gaHlkcmF0ZWQgb3IgZGVsZXRlZC5cblxuIC8vIFBhcnQgb2YgdGhlIHNpbXBsaWZpY2F0aW9uIG9mIFJlYWN0LmNyZWF0ZUVsZW1lbnQgc28gd2UgY2FuIGV2ZW50dWFsbHkgbW92ZVxuLy8gZnJvbSBSZWFjdC5jcmVhdGVFbGVtZW50IHRvIFJlYWN0LmpzeFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9ibG9iL2NyZWF0ZWxlbWVudC1yZmMvdGV4dC8wMDAwLWNyZWF0ZS1lbGVtZW50LWNoYW5nZXMubWRcblxuXG5cblxuXG4gLy8gRmxhZyB0byB0dXJuIGV2ZW50LnRhcmdldCBhbmQgZXZlbnQuY3VycmVudFRhcmdldCBpbiBSZWFjdE5hdGl2ZSBmcm9tIGEgcmVhY3RUYWcgdG8gYSBjb21wb25lbnQgaW5zdGFuY2VcblxudmFyIERFRkFVTFRfVEhSRUFEX0lEID0gMDsgLy8gQ291bnRlcnMgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLlxuXG52YXIgaW50ZXJhY3Rpb25JRENvdW50ZXIgPSAwO1xudmFyIHRocmVhZElEQ291bnRlciA9IDA7IC8vIFNldCBvZiBjdXJyZW50bHkgdHJhY2VkIGludGVyYWN0aW9ucy5cbi8vIEludGVyYWN0aW9ucyBcInN0YWNrXCLigJNcbi8vIE1lYW5pbmcgdGhhdCBuZXdseSB0cmFjZWQgaW50ZXJhY3Rpb25zIGFyZSBhcHBlbmRlZCB0byB0aGUgcHJldmlvdXNseSBhY3RpdmUgc2V0LlxuLy8gV2hlbiBhbiBpbnRlcmFjdGlvbiBnb2VzIG91dCBvZiBzY29wZSwgdGhlIHByZXZpb3VzIHNldCAoaWYgYW55KSBpcyByZXN0b3JlZC5cblxudmFyIGludGVyYWN0aW9uc1JlZiA9IG51bGw7IC8vIExpc3RlbmVyKHMpIHRvIG5vdGlmeSB3aGVuIGludGVyYWN0aW9ucyBiZWdpbiBhbmQgZW5kLlxuXG52YXIgc3Vic2NyaWJlclJlZiA9IG51bGw7XG5cbmlmIChlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gIGludGVyYWN0aW9uc1JlZiA9IHtcbiAgICBjdXJyZW50OiBuZXcgU2V0KClcbiAgfTtcbiAgc3Vic2NyaWJlclJlZiA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NsZWFyKGNhbGxiYWNrKSB7XG4gIGlmICghZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgdmFyIHByZXZJbnRlcmFjdGlvbnMgPSBpbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcbiAgaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBuZXcgU2V0KCk7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IHByZXZJbnRlcmFjdGlvbnM7XG4gIH1cbn1cbmZ1bmN0aW9uIHVuc3RhYmxlX2dldEN1cnJlbnQoKSB7XG4gIGlmICghZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcbiAgfVxufVxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0VGhyZWFkSUQoKSB7XG4gIHJldHVybiArK3RocmVhZElEQ291bnRlcjtcbn1cbmZ1bmN0aW9uIHVuc3RhYmxlX3RyYWNlKG5hbWUsIHRpbWVzdGFtcCwgY2FsbGJhY2spIHtcbiAgdmFyIHRocmVhZElEID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBERUZBVUxUX1RIUkVBRF9JRDtcblxuICBpZiAoIWVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgfVxuXG4gIHZhciBpbnRlcmFjdGlvbiA9IHtcbiAgICBfX2NvdW50OiAxLFxuICAgIGlkOiBpbnRlcmFjdGlvbklEQ291bnRlcisrLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgdGltZXN0YW1wOiB0aW1lc3RhbXBcbiAgfTtcbiAgdmFyIHByZXZJbnRlcmFjdGlvbnMgPSBpbnRlcmFjdGlvbnNSZWYuY3VycmVudDsgLy8gVHJhY2VkIGludGVyYWN0aW9ucyBzaG91bGQgc3RhY2svYWNjdW11bGF0ZS5cbiAgLy8gVG8gZG8gdGhhdCwgY2xvbmUgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb25zLlxuICAvLyBUaGUgcHJldmlvdXMgc2V0IHdpbGwgYmUgcmVzdG9yZWQgdXBvbiBjb21wbGV0aW9uLlxuXG4gIHZhciBpbnRlcmFjdGlvbnMgPSBuZXcgU2V0KHByZXZJbnRlcmFjdGlvbnMpO1xuICBpbnRlcmFjdGlvbnMuYWRkKGludGVyYWN0aW9uKTtcbiAgaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBpbnRlcmFjdGlvbnM7XG4gIHZhciBzdWJzY3JpYmVyID0gc3Vic2NyaWJlclJlZi5jdXJyZW50O1xuICB2YXIgcmV0dXJuVmFsdWU7XG5cbiAgdHJ5IHtcbiAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCkge1xuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uVHJhY2VkKGludGVyYWN0aW9uKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RhcnRlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSBjYWxsYmFjaygpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBwcmV2SW50ZXJhY3Rpb25zO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RvcHBlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaW50ZXJhY3Rpb24uX19jb3VudC0tOyAvLyBJZiBubyBhc3luYyB3b3JrIHdhcyBzY2hlZHVsZWQgZm9yIHRoaXMgaW50ZXJhY3Rpb24sXG4gICAgICAgICAgLy8gTm90aWZ5IHN1YnNjcmliZXJzIHRoYXQgaXQncyBjb21wbGV0ZWQuXG5cbiAgICAgICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCAmJiBpbnRlcmFjdGlvbi5fX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm9uSW50ZXJhY3Rpb25TY2hlZHVsZWRXb3JrQ29tcGxldGVkKGludGVyYWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59XG5mdW5jdGlvbiB1bnN0YWJsZV93cmFwKGNhbGxiYWNrKSB7XG4gIHZhciB0aHJlYWRJRCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogREVGQVVMVF9USFJFQURfSUQ7XG5cbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrO1xuICB9XG5cbiAgdmFyIHdyYXBwZWRJbnRlcmFjdGlvbnMgPSBpbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcbiAgdmFyIHN1YnNjcmliZXIgPSBzdWJzY3JpYmVyUmVmLmN1cnJlbnQ7XG5cbiAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICBzdWJzY3JpYmVyLm9uV29ya1NjaGVkdWxlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gIH0gLy8gVXBkYXRlIHRoZSBwZW5kaW5nIGFzeW5jIHdvcmsgY291bnQgZm9yIHRoZSBjdXJyZW50IGludGVyYWN0aW9ucy5cbiAgLy8gVXBkYXRlIGFmdGVyIGNhbGxpbmcgc3Vic2NyaWJlcnMgaW4gY2FzZSBvZiBlcnJvci5cblxuXG4gIHdyYXBwZWRJbnRlcmFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW50ZXJhY3Rpb24pIHtcbiAgICBpbnRlcmFjdGlvbi5fX2NvdW50Kys7XG4gIH0pO1xuICB2YXIgaGFzUnVuID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gd3JhcHBlZCgpIHtcbiAgICB2YXIgcHJldkludGVyYWN0aW9ucyA9IGludGVyYWN0aW9uc1JlZi5jdXJyZW50O1xuICAgIGludGVyYWN0aW9uc1JlZi5jdXJyZW50ID0gd3JhcHBlZEludGVyYWN0aW9ucztcbiAgICBzdWJzY3JpYmVyID0gc3Vic2NyaWJlclJlZi5jdXJyZW50O1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXR1cm5WYWx1ZTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm9uV29ya1N0YXJ0ZWQod3JhcHBlZEludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGludGVyYWN0aW9uc1JlZi5jdXJyZW50ID0gcHJldkludGVyYWN0aW9ucztcblxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm9uV29ya1N0b3BwZWQod3JhcHBlZEludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghaGFzUnVuKSB7XG4gICAgICAgIC8vIFdlIG9ubHkgZXhwZWN0IGEgd3JhcHBlZCBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlLFxuICAgICAgICAvLyBCdXQgaW4gdGhlIGV2ZW50IHRoYXQgaXQncyBleGVjdXRlZCBtb3JlIHRoYW4gb25jZeKAk1xuICAgICAgICAvLyBPbmx5IGRlY3JlbWVudCB0aGUgb3V0c3RhbmRpbmcgaW50ZXJhY3Rpb24gY291bnRzIG9uY2UuXG4gICAgICAgIGhhc1J1biA9IHRydWU7IC8vIFVwZGF0ZSBwZW5kaW5nIGFzeW5jIGNvdW50cyBmb3IgYWxsIHdyYXBwZWQgaW50ZXJhY3Rpb25zLlxuICAgICAgICAvLyBJZiB0aGlzIHdhcyB0aGUgbGFzdCBzY2hlZHVsZWQgYXN5bmMgd29yayBmb3IgYW55IG9mIHRoZW0sXG4gICAgICAgIC8vIE1hcmsgdGhlbSBhcyBjb21wbGV0ZWQuXG5cbiAgICAgICAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgICAgICAgIGludGVyYWN0aW9uLl9fY291bnQtLTtcblxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlZC5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgc3Vic2NyaWJlciA9IHN1YnNjcmliZXJSZWYuY3VycmVudDtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCkge1xuICAgICAgICBzdWJzY3JpYmVyLm9uV29ya0NhbmNlbGVkKHdyYXBwZWRJbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gVXBkYXRlIHBlbmRpbmcgYXN5bmMgY291bnRzIGZvciBhbGwgd3JhcHBlZCBpbnRlcmFjdGlvbnMuXG4gICAgICAvLyBJZiB0aGlzIHdhcyB0aGUgbGFzdCBzY2hlZHVsZWQgYXN5bmMgd29yayBmb3IgYW55IG9mIHRoZW0sXG4gICAgICAvLyBNYXJrIHRoZW0gYXMgY29tcGxldGVkLlxuICAgICAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgICAgICBpbnRlcmFjdGlvbi5fX2NvdW50LS07XG5cbiAgICAgICAgaWYgKHN1YnNjcmliZXIgJiYgaW50ZXJhY3Rpb24uX19jb3VudCA9PT0gMCkge1xuICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbnZhciBzdWJzY3JpYmVycyA9IG51bGw7XG5cbmlmIChlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gIHN1YnNjcmliZXJzID0gbmV3IFNldCgpO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICBpZiAoZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHN1YnNjcmliZXJzLmFkZChzdWJzY3JpYmVyKTtcblxuICAgIGlmIChzdWJzY3JpYmVycy5zaXplID09PSAxKSB7XG4gICAgICBzdWJzY3JpYmVyUmVmLmN1cnJlbnQgPSB7XG4gICAgICAgIG9uSW50ZXJhY3Rpb25TY2hlZHVsZWRXb3JrQ29tcGxldGVkOiBvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZCxcbiAgICAgICAgb25JbnRlcmFjdGlvblRyYWNlZDogb25JbnRlcmFjdGlvblRyYWNlZCxcbiAgICAgICAgb25Xb3JrQ2FuY2VsZWQ6IG9uV29ya0NhbmNlbGVkLFxuICAgICAgICBvbldvcmtTY2hlZHVsZWQ6IG9uV29ya1NjaGVkdWxlZCxcbiAgICAgICAgb25Xb3JrU3RhcnRlZDogb25Xb3JrU3RhcnRlZCxcbiAgICAgICAgb25Xb3JrU3RvcHBlZDogb25Xb3JrU3RvcHBlZFxuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHVuc3RhYmxlX3Vuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgaWYgKGVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgICBzdWJzY3JpYmVycy5kZWxldGUoc3Vic2NyaWJlcik7XG5cbiAgICBpZiAoc3Vic2NyaWJlcnMuc2l6ZSA9PT0gMCkge1xuICAgICAgc3Vic2NyaWJlclJlZi5jdXJyZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb25JbnRlcmFjdGlvblRyYWNlZChpbnRlcmFjdGlvbikge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblRyYWNlZChpbnRlcmFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pIHtcbiAgdmFyIGRpZENhdGNoRXJyb3IgPSBmYWxzZTtcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcbiAgc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgIHRyeSB7XG4gICAgICBzdWJzY3JpYmVyLm9uSW50ZXJhY3Rpb25TY2hlZHVsZWRXb3JrQ29tcGxldGVkKGludGVyYWN0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKCFkaWRDYXRjaEVycm9yKSB7XG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xuICAgICAgICBjYXVnaHRFcnJvciA9IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcbiAgICB0aHJvdyBjYXVnaHRFcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbldvcmtTY2hlZHVsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrU2NoZWR1bGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya1N0YXJ0ZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RhcnRlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKCFkaWRDYXRjaEVycm9yKSB7XG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xuICAgICAgICBjYXVnaHRFcnJvciA9IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcbiAgICB0aHJvdyBjYXVnaHRFcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbldvcmtTdG9wcGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpIHtcbiAgdmFyIGRpZENhdGNoRXJyb3IgPSBmYWxzZTtcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcbiAgc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgIHRyeSB7XG4gICAgICBzdWJzY3JpYmVyLm9uV29ya1N0b3BwZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25Xb3JrQ2FuY2VsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrQ2FuY2VsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuXG5cbnZhciBTY2hlZHVsZXJUcmFjaW5nID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGdldCBfX2ludGVyYWN0aW9uc1JlZiAoKSB7IHJldHVybiBpbnRlcmFjdGlvbnNSZWY7IH0sXG5cdGdldCBfX3N1YnNjcmliZXJSZWYgKCkgeyByZXR1cm4gc3Vic2NyaWJlclJlZjsgfSxcblx0dW5zdGFibGVfY2xlYXI6IHVuc3RhYmxlX2NsZWFyLFxuXHR1bnN0YWJsZV9nZXRDdXJyZW50OiB1bnN0YWJsZV9nZXRDdXJyZW50LFxuXHR1bnN0YWJsZV9nZXRUaHJlYWRJRDogdW5zdGFibGVfZ2V0VGhyZWFkSUQsXG5cdHVuc3RhYmxlX3RyYWNlOiB1bnN0YWJsZV90cmFjZSxcblx0dW5zdGFibGVfd3JhcDogdW5zdGFibGVfd3JhcCxcblx0dW5zdGFibGVfc3Vic2NyaWJlOiB1bnN0YWJsZV9zdWJzY3JpYmUsXG5cdHVuc3RhYmxlX3Vuc3Vic2NyaWJlOiB1bnN0YWJsZV91bnN1YnNjcmliZVxufSk7XG5cbnZhciBSZWFjdFNoYXJlZEludGVybmFscyQyID0ge1xuICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyOiBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLFxuICBSZWFjdEN1cnJlbnRPd25lcjogUmVhY3RDdXJyZW50T3duZXIsXG4gIElzU29tZVJlbmRlcmVyQWN0aW5nOiBJc1NvbWVSZW5kZXJlckFjdGluZyxcbiAgLy8gVXNlZCBieSByZW5kZXJlcnMgdG8gYXZvaWQgYnVuZGxpbmcgb2JqZWN0LWFzc2lnbiB0d2ljZSBpbiBVTUQgYnVuZGxlczpcbiAgYXNzaWduOiBvYmplY3RBc3NpZ25cbn07XG5cbntcbiAgb2JqZWN0QXNzaWduKFJlYWN0U2hhcmVkSW50ZXJuYWxzJDIsIHtcbiAgICAvLyBUaGVzZSBzaG91bGQgbm90IGJlIGluY2x1ZGVkIGluIHByb2R1Y3Rpb24uXG4gICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTogUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSxcbiAgICAvLyBTaGltIGZvciBSZWFjdCBET00gMTYuMC4wIHdoaWNoIHN0aWxsIGRlc3RydWN0dXJlZCAoYnV0IG5vdCB1c2VkKSB0aGlzLlxuICAgIC8vIFRPRE86IHJlbW92ZSBpbiBSZWFjdCAxNy4wLlxuICAgIFJlYWN0Q29tcG9uZW50VHJlZUhvb2s6IHt9XG4gIH0pO1xufSAvLyBSZS1leHBvcnQgdGhlIHNjaGVkdWxlIEFQSShzKSBmb3IgVU1EIGJ1bmRsZXMuXG4vLyBUaGlzIGF2b2lkcyBpbnRyb2R1Y2luZyBhIGRlcGVuZGVuY3kgb24gYSBuZXcgVU1EIGdsb2JhbCBpbiBhIG1pbm9yIHVwZGF0ZSxcbi8vIFNpbmNlIHRoYXQgd291bGQgYmUgYSBicmVha2luZyBjaGFuZ2UgKGUuZy4gZm9yIGFsbCBleGlzdGluZyBDb2RlU2FuZGJveGVzKS5cbi8vIFRoaXMgcmUtZXhwb3J0IGlzIG9ubHkgcmVxdWlyZWQgZm9yIFVNRCBidW5kbGVzO1xuLy8gQ0pTIGJ1bmRsZXMgdXNlIHRoZSBzaGFyZWQgTlBNIHBhY2thZ2UuXG5cblxub2JqZWN0QXNzaWduKFJlYWN0U2hhcmVkSW50ZXJuYWxzJDIsIHtcbiAgU2NoZWR1bGVyOiBTY2hlZHVsZXIsXG4gIFNjaGVkdWxlclRyYWNpbmc6IFNjaGVkdWxlclRyYWNpbmdcbn0pO1xuXG52YXIgaGFzQmFkTWFwUG9seWZpbGw7XG5cbntcbiAgaGFzQmFkTWFwUG9seWZpbGwgPSBmYWxzZTtcblxuICB0cnkge1xuICAgIHZhciBmcm96ZW5PYmplY3QgPSBPYmplY3QuZnJlZXplKHt9KTtcbiAgICB2YXIgdGVzdE1hcCA9IG5ldyBNYXAoW1tmcm96ZW5PYmplY3QsIG51bGxdXSk7XG4gICAgdmFyIHRlc3RTZXQgPSBuZXcgU2V0KFtmcm96ZW5PYmplY3RdKTsgLy8gVGhpcyBpcyBuZWNlc3NhcnkgZm9yIFJvbGx1cCB0byBub3QgY29uc2lkZXIgdGhlc2UgdW51c2VkLlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xNzcxXG4gICAgLy8gVE9ETzogd2UgY2FuIHJlbW92ZSB0aGVzZSBpZiBSb2xsdXAgZml4ZXMgdGhlIGJ1Zy5cblxuICAgIHRlc3RNYXAuc2V0KDAsIDApO1xuICAgIHRlc3RTZXQuYWRkKDApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gVE9ETzogQ29uc2lkZXIgd2FybmluZyBhYm91dCBiYWQgcG9seWZpbGxzXG4gICAgaGFzQmFkTWFwUG9seWZpbGwgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmRhbWVudGFsQ29tcG9uZW50KGltcGwpIHtcbiAgLy8gV2UgdXNlIHJlc3BvbmRlciBhcyBhIE1hcCBrZXkgbGF0ZXIgb24uIFdoZW4gd2UgaGF2ZSBhIGJhZFxuICAvLyBwb2x5ZmlsbCwgdGhlbiB3ZSBjYW4ndCB1c2UgaXQgYXMgYSBrZXkgYXMgdGhlIHBvbHlmaWxsIHRyaWVzXG4gIC8vIHRvIGFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QuXG4gIGlmICh0cnVlICYmICFoYXNCYWRNYXBQb2x5ZmlsbCkge1xuICAgIE9iamVjdC5mcmVlemUoaW1wbCk7XG4gIH1cblxuICB2YXIgZnVuZGFtYW50YWxDb21wb25lbnQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUsXG4gICAgaW1wbDogaW1wbFxuICB9O1xuXG4gIHtcbiAgICBPYmplY3QuZnJlZXplKGZ1bmRhbWFudGFsQ29tcG9uZW50KTtcbiAgfVxuXG4gIHJldHVybiBmdW5kYW1hbnRhbENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRXZlbnRSZXNwb25kZXIoZGlzcGxheU5hbWUsIHJlc3BvbmRlckNvbmZpZykge1xuICB2YXIgZ2V0SW5pdGlhbFN0YXRlID0gcmVzcG9uZGVyQ29uZmlnLmdldEluaXRpYWxTdGF0ZSxcbiAgICAgIG9uRXZlbnQgPSByZXNwb25kZXJDb25maWcub25FdmVudCxcbiAgICAgIG9uTW91bnQgPSByZXNwb25kZXJDb25maWcub25Nb3VudCxcbiAgICAgIG9uVW5tb3VudCA9IHJlc3BvbmRlckNvbmZpZy5vblVubW91bnQsXG4gICAgICBvblJvb3RFdmVudCA9IHJlc3BvbmRlckNvbmZpZy5vblJvb3RFdmVudCxcbiAgICAgIHJvb3RFdmVudFR5cGVzID0gcmVzcG9uZGVyQ29uZmlnLnJvb3RFdmVudFR5cGVzLFxuICAgICAgdGFyZ2V0RXZlbnRUeXBlcyA9IHJlc3BvbmRlckNvbmZpZy50YXJnZXRFdmVudFR5cGVzLFxuICAgICAgdGFyZ2V0UG9ydGFsUHJvcGFnYXRpb24gPSByZXNwb25kZXJDb25maWcudGFyZ2V0UG9ydGFsUHJvcGFnYXRpb247XG4gIHZhciBldmVudFJlc3BvbmRlciA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfUkVTUE9OREVSX1RZUEUsXG4gICAgZGlzcGxheU5hbWU6IGRpc3BsYXlOYW1lLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZ2V0SW5pdGlhbFN0YXRlIHx8IG51bGwsXG4gICAgb25FdmVudDogb25FdmVudCB8fCBudWxsLFxuICAgIG9uTW91bnQ6IG9uTW91bnQgfHwgbnVsbCxcbiAgICBvblJvb3RFdmVudDogb25Sb290RXZlbnQgfHwgbnVsbCxcbiAgICBvblVubW91bnQ6IG9uVW5tb3VudCB8fCBudWxsLFxuICAgIHJvb3RFdmVudFR5cGVzOiByb290RXZlbnRUeXBlcyB8fCBudWxsLFxuICAgIHRhcmdldEV2ZW50VHlwZXM6IHRhcmdldEV2ZW50VHlwZXMgfHwgbnVsbCxcbiAgICB0YXJnZXRQb3J0YWxQcm9wYWdhdGlvbjogdGFyZ2V0UG9ydGFsUHJvcGFnYXRpb24gfHwgZmFsc2VcbiAgfTsgLy8gV2UgdXNlIHJlc3BvbmRlciBhcyBhIE1hcCBrZXkgbGF0ZXIgb24uIFdoZW4gd2UgaGF2ZSBhIGJhZFxuICAvLyBwb2x5ZmlsbCwgdGhlbiB3ZSBjYW4ndCB1c2UgaXQgYXMgYSBrZXkgYXMgdGhlIHBvbHlmaWxsIHRyaWVzXG4gIC8vIHRvIGFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QuXG5cbiAgaWYgKHRydWUgJiYgIWhhc0JhZE1hcFBvbHlmaWxsKSB7XG4gICAgT2JqZWN0LmZyZWV6ZShldmVudFJlc3BvbmRlcik7XG4gIH1cblxuICByZXR1cm4gZXZlbnRSZXNwb25kZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNjb3BlKCkge1xuICB2YXIgc2NvcGVDb21wb25lbnQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1NDT1BFX1RZUEVcbiAgfTtcblxuICB7XG4gICAgT2JqZWN0LmZyZWV6ZShzY29wZUNvbXBvbmVudCk7XG4gIH1cblxuICByZXR1cm4gc2NvcGVDb21wb25lbnQ7XG59XG5cbnZhciBSZWFjdCA9IHtcbiAgQ2hpbGRyZW46IHtcbiAgICBtYXA6IG1hcENoaWxkcmVuLFxuICAgIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuICBjcmVhdGVSZWY6IGNyZWF0ZVJlZixcbiAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQ6IFB1cmVDb21wb25lbnQsXG4gIGNyZWF0ZUNvbnRleHQ6IGNyZWF0ZUNvbnRleHQsXG4gIGZvcndhcmRSZWY6IGZvcndhcmRSZWYsXG4gIGxhenk6IGxhenksXG4gIG1lbW86IG1lbW8sXG4gIHVzZUNhbGxiYWNrOiB1c2VDYWxsYmFjayxcbiAgdXNlQ29udGV4dDogdXNlQ29udGV4dCxcbiAgdXNlRWZmZWN0OiB1c2VFZmZlY3QsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGU6IHVzZUltcGVyYXRpdmVIYW5kbGUsXG4gIHVzZURlYnVnVmFsdWU6IHVzZURlYnVnVmFsdWUsXG4gIHVzZUxheW91dEVmZmVjdDogdXNlTGF5b3V0RWZmZWN0LFxuICB1c2VNZW1vOiB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyOiB1c2VSZWR1Y2VyLFxuICB1c2VSZWY6IHVzZVJlZixcbiAgdXNlU3RhdGU6IHVzZVN0YXRlLFxuICBGcmFnbWVudDogUkVBQ1RfRlJBR01FTlRfVFlQRSxcbiAgUHJvZmlsZXI6IFJFQUNUX1BST0ZJTEVSX1RZUEUsXG4gIFN0cmljdE1vZGU6IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUsXG4gIFN1c3BlbnNlOiBSRUFDVF9TVVNQRU5TRV9UWVBFLFxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbixcbiAgaXNWYWxpZEVsZW1lbnQ6IGlzVmFsaWRFbGVtZW50LFxuICB2ZXJzaW9uOiBSZWFjdFZlcnNpb24sXG4gIF9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEOiBSZWFjdFNoYXJlZEludGVybmFscyQyXG59O1xuXG5pZiAoZXhwb3NlQ29uY3VycmVudE1vZGVBUElzKSB7XG4gIFJlYWN0LnVzZVRyYW5zaXRpb24gPSB1c2VUcmFuc2l0aW9uO1xuICBSZWFjdC51c2VEZWZlcnJlZFZhbHVlID0gdXNlRGVmZXJyZWRWYWx1ZTtcbiAgUmVhY3QuU3VzcGVuc2VMaXN0ID0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFO1xuICBSZWFjdC51bnN0YWJsZV93aXRoU3VzcGVuc2VDb25maWcgPSB3aXRoU3VzcGVuc2VDb25maWc7XG59XG5cbmlmIChlbmFibGVGbGFyZUFQSSkge1xuICBSZWFjdC51bnN0YWJsZV91c2VSZXNwb25kZXIgPSB1c2VSZXNwb25kZXI7XG4gIFJlYWN0LnVuc3RhYmxlX2NyZWF0ZVJlc3BvbmRlciA9IGNyZWF0ZUV2ZW50UmVzcG9uZGVyO1xufVxuXG5pZiAoZW5hYmxlRnVuZGFtZW50YWxBUEkpIHtcbiAgUmVhY3QudW5zdGFibGVfY3JlYXRlRnVuZGFtZW50YWwgPSBjcmVhdGVGdW5kYW1lbnRhbENvbXBvbmVudDtcbn1cblxuaWYgKGVuYWJsZVNjb3BlQVBJKSB7XG4gIFJlYWN0LnVuc3RhYmxlX2NyZWF0ZVNjb3BlID0gY3JlYXRlU2NvcGU7XG59IC8vIE5vdGU6IHNvbWUgQVBJcyBhcmUgYWRkZWQgd2l0aCBmZWF0dXJlIGZsYWdzLlxuLy8gTWFrZSBzdXJlIHRoYXQgc3RhYmxlIGJ1aWxkcyBmb3Igb3BlbiBzb3VyY2Vcbi8vIGRvbid0IG1vZGlmeSB0aGUgUmVhY3Qgb2JqZWN0IHRvIGF2b2lkIGRlb3B0cy5cbi8vIEFsc28gbGV0J3Mgbm90IGV4cG9zZSB0aGVpciBuYW1lcyBpbiBzdGFibGUgYnVpbGRzLlxuXG5cbmlmIChlbmFibGVKU1hUcmFuc2Zvcm1BUEkpIHtcbiAge1xuICAgIFJlYWN0LmpzeERFViA9IGpzeFdpdGhWYWxpZGF0aW9uO1xuICAgIFJlYWN0LmpzeCA9IGpzeFdpdGhWYWxpZGF0aW9uRHluYW1pYztcbiAgICBSZWFjdC5qc3hzID0ganN4V2l0aFZhbGlkYXRpb25TdGF0aWM7XG4gIH1cbn1cblxuXG5cbnZhciBSZWFjdCQyID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGRlZmF1bHQ6IFJlYWN0XG59KTtcblxudmFyIFJlYWN0JDMgPSAoIFJlYWN0JDIgJiYgUmVhY3QgKSB8fCBSZWFjdCQyO1xuXG4vLyBUT0RPOiBkZWNpZGUgb24gdGhlIHRvcC1sZXZlbCBleHBvcnQgZm9ybS5cbi8vIFRoaXMgaXMgaGFja3kgYnV0IG1ha2VzIGl0IHdvcmsgd2l0aCBib3RoIFJvbGx1cCBhbmQgSmVzdC5cblxuXG52YXIgcmVhY3QgPSBSZWFjdCQzLmRlZmF1bHQgfHwgUmVhY3QkMztcblxucmV0dXJuIHJlYWN0O1xuXG59KSkpO1xuIl19