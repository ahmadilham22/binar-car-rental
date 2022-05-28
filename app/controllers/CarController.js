const ApplicationController = require("./ApplicationController");
const { Car } = require("../models");

class CarController extends ApplicationController {
  constructor({ carModel = Car }) {
    super();
    this.carModel = carModel;
  }

  handleListCars = async (req, res) => {
    const offset = this.getOffsetFromRequest(req);
    const limit = req.query.pageSize;
    const query = this.getListQueryFromRequest(req);
    const cars = await this.carModel.findAll(query);
    const carCount = await this.carModel.count({ where: query.where, include: query.include, });
    const pagination = this.buildPaginationObject(req, carCount);

    res.status(200).json({
      cars,
      meta: {
        pagination,
      }
    });
  }

  handleGetCar = async (req, res) => {
    const car = await this.getCarFromRequest(req); 

    res.status(200).json(car);
  }

  handleCreateCar = async (req, res) => {
    try {
      const {
        name,
        price,
        size,
        image,
      } = req.body;

      const car = await this.carModel.create({
        name,
        price,
        size,
        image,
        isCurrentlyRented: false,
      });

      res.status(201).json(car);
    }

    catch(err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  }

  handleUpdateCar = async (req, res) => {
    try {
      const {
        name,
        price,
        size,
        image,
      } = req.body;

      const car = this.getCarFromRequest(req);

      await car.update({
        name,
        price,
        size,
        image,
        isCurrentlyRented: false,
      });

      res.status(200).json(car);
    }

    catch(err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  }

  handleDeleteCar = async (req, res) => {
    const car = await this.carModel.destroy(req.params.id); 
    res.status(204).end();
  }

  getCarFromRequest(req) {
    return this.carModel.findByPk(req.params.id);
  }

  getListQueryFromRequest(req) {
    const { size } = req.query;
    const offset = this.getOffsetFromRequest(req);
    const limit = req.query.pageSize;
    const where = {};

    if (!!size) where.size = size;

    const query = {
      where,
      limit,
      offset,
    }

    return where;
  }
}

module.exports = CarController;
