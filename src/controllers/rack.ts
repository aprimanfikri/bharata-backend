import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { rackSchema } from '../validation';
import ApiError from '../utils/error';

export const getAllRacks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const racks = await prisma.rack.findMany({
      include: {
        products: true,
      },
    });

    res.json({
      success: true,
      message: 'Racks fetched successfully',
      data: {
        racks,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createRack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = rackSchema.parse(req.body);

    const rackExists = await prisma.rack.findUnique({
      where: {
        name,
      },
    });

    if (rackExists) {
      throw new ApiError('Rack already exists', 409);
    }

    const rack = await prisma.rack.create({
      data: {
        name,
      },
      include: {
        products: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Rack created successfully',
      data: {
        rack,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRackById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const rack = await prisma.rack.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });

    if (!rack) {
      throw new ApiError('Rack not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Rack fetched successfully',
      data: {
        rack,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const { name } = rackSchema.parse(req.body);

    const existingRack = await prisma.rack.findUnique({
      where: { id },
    });

    if (!existingRack) {
      throw new ApiError('Rack not found', 404);
    }

    const rackWithSameName = await prisma.rack.findUnique({
      where: { name },
    });

    if (rackWithSameName && rackWithSameName.id !== id) {
      throw new ApiError('Rack with same name already exists', 409);
    }

    const updatedRack = await prisma.rack.update({
      where: { id },
      data: { name },
      include: {
        products: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Rack updated successfully',
      data: {
        rack: updatedRack,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const existingRack = await prisma.rack.findUnique({
      where: { id },
    });

    if (!existingRack) {
      throw new ApiError('Rack not found', 404);
    }

    await prisma.rack.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Rack deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
