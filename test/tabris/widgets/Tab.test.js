import {expect} from "../../test";
import NativeBridgeSpy from "../NativeBridgeSpy";
import Tab from "../../../src/tabris/widgets/Tab";
import Composite from "../../../src/tabris/widgets/Composite";
import ProxyStore from "../../../src/tabris/ProxyStore";
import NativeBridge from "../../../src/tabris/NativeBridge";

describe("Tab", function() {

  let nativeBridge;

  beforeEach(function() {
    nativeBridge = new NativeBridgeSpy();
    global.tabris = {
      on: () => {},
      _proxies: new ProxyStore(),
      _notify: (cid, event, param) => tabris._proxies.find(cid)._trigger(event, param)
    };
    global.tabris._nativeBridge = new NativeBridge(nativeBridge);
    nativeBridge.resetCalls();
  });

  describe("when created", function() {

    let tab, create;

    beforeEach(function() {
      tab = new Tab({
        title: "foo",
        image: {src: "bar"},
        selectedImage: {src: "selectedBar"},
        badge: "1",
        background: "#010203",
        visible: false
      });
      create = nativeBridge.calls({op: "create"})[0];
    });

    it("creates a Tab", function() {
      expect(create.type).to.equal("tabris.Tab");
      expect(create.id).to.equal(tab.cid);
    });

    it("getter returns initial properties", function() {
      tab = new Tab();
      expect(tab.get("title")).to.equal("");
      expect(tab.get("image")).to.equal(null);
      expect(tab.get("selectedImage")).to.equal(null);
      expect(tab.get("badge")).to.equal("");
      expect(tab.get("visible")).to.equal(true);
    });

    it("crashes when appended to an illegal parent", function() {
      expect(() => {
        tab.appendTo(new Composite());
      }).to.throw("Tab must be a child of TabFolder");
    });

  });

});