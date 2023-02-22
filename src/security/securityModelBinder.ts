export interface SecurityModelBinder<TSecurityContract, TSecurityModel> {
    contractToModel(contract: TSecurityContract): Promise<TSecurityModel>;
    modelToContract(model: TSecurityModel): TSecurityContract;
}
