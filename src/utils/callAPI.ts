import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import axios, { AxiosRequestConfig } from 'axios'
import { Agent } from 'https'
const { HOST_URL } = GlobalConfig
interface Option extends AxiosRequestConfig {
  throwError?: boolean
  jwt?: string
  baseURL?: string
}
const createInstance = (prefix: string, options: Option) => {
  const baseURL = `${options.baseURL || HOST_URL}/${prefix}`
  const instanceOption: AxiosRequestConfig = {
    baseURL,
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  }
  if (options.headers) {
    instanceOption.headers = options.headers
  }

  if (options.jwt) {
    if (instanceOption.headers) {
      instanceOption.headers.Authorization = `Bearer ${options.jwt}`
    } else {
      instanceOption.headers = { Authorization: `Bearer ${options.jwt}` }
    }
    return axios.create(instanceOption)
  }
  return axios.create(instanceOption)
}

const checkError = (error: any, prefix: string) => {
  if (error?.response?.data?.code) {
    if (error.response.data.code === 401) {
      throw new UnauthorizedException('Session timeout, please login again')
    } else {
      throw new BadRequestException(error.response.data)
    }
  }

  throw new InternalServerErrorException(
    `There are unknown error from ${prefix}`
  )
}

const callAPI = function (prefix: string, options?: Option) {
  const { throwError = true, ...restOptions } = options || {}
  const instance = createInstance(prefix, restOptions)

  return {
    get: async (route: string, params?: any) => {
      try {
        const { data } = await instance.get(route, params)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    post: async <P = any, D = any>(route: string, body: P) => {
      try {
        const { data } = await instance.post<D>(route, body)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    put: async (route: string, body: {}) => {
      try {
        const { data } = await instance.put(route, body)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    patch: async (route: string, body: {}) => {
      try {
        const { data } = await instance.patch(route, body)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    delete: async (route: string) => {
      try {
        const { data } = await instance.delete(route)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
  }
}
export { callAPI }

