/*
 * File: CVehicleEntity.js
 * File Created: 2018-12-19 16:02:28
 * Author: Jacky (jackylvm@foxmail.com>)
 * -----
 * Last Modified: 2018-12-21 10:57:09
 * Modified By: Jacky (jackylvm@foxmail.com>)
 * -----
 * Copyright 2018 上海火刀石网络科技有限公司
 * -----
 * HISTORY:
 * Date      			By			Comments
 * --------------------	---------	----------------------------------
 */
import CMovingEntity from "CMovingEntity";
import CSteeringBehavior from "CSteeringBehavior";
import SmootherVec2 from "CSmootherVec2";
import {
    EnumConst
} from "CEnum";

cc.Class({
    extends: CMovingEntity,

    properties: {
        timeElapsed: 0.0,
        vecSmoothedHeading: new cc.v2(0, 0),
        bSmoothingOn: false,
        vehicleVB: []
    },
    initVehicleEntity(world, position, rotation, velocity, mass, maxForce, maxSpeed, maxTurnRate, scale) {
        var self = this;

        self._world = world;

        //Math.sin(rotation), -Math.cos(rotation)
        self.initMovingEntity(position, scale, velocity, maxSpeed,
            new cc.v2(0, 1), mass,
            new cc.v2(scale, scale), maxTurnRate, maxForce)

        self._steering = new CSteeringBehavior();
        self._steering.init(self);

        self._headingSmoother = new SmootherVec2();

        self._steering.seekOn();
    },
    world() {
        var self = this;
        return self._world;
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        var self = this;

        self.node.setPosition(self.pos());
        self.updateRotation();
    },
    // start() {},
    update(dt) {
        var self = this;

        var _steeringForce = self._steering.calculate();

        var _acceleration = _steeringForce.div(self.mass());
        self.velocity().addSelf(_acceleration.mulSelf(dt));

        if (self.velocity().mag() > self.maxSpeed()) {
            self.velocity().normalizeSelf().mulSelf(self.maxSpeed());
        }

        var _out = self.velocity().mul(dt);
        self.pos().addSelf(_out);
        self.node.setPosition(self.pos());

        if (self.velocity().magSqr() > 0.00000001) {
            _out = self.velocity().normalize();
            self.setHeading(_out);
        }

        self.node.setScale(self.scale().x, self.scale().y);
    },
});